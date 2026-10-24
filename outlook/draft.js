/* Shared draft reader. Inside-only mail stops after addresses; external mail reads all outgoing text.
   Metadata is re-read before release, plus byte hashes for OCR-eligible files. */
(function(root) {
  'use strict';
  var READABLE=/\.(pdf|docx|xlsx|pptx|csv|txt)$/i, IMAGE=/\.(png|jpe?g|gif|bmp|tiff?|webp)$/i, MAX_BYTES=10*1024*1024;
  function image(a) { return a.type==='file' && (IMAGE.test(a.name) || /^image\//i.test(a.contentType)); }
  function ocrFile(a) { return a.type==='file' && (image(a) || /\.(pdf|docx|pptx|xlsx)$/i.test(a.name)); }
  function call(target,method,args) {
    return new Promise(function(resolve,reject) {
      target[method].apply(target,(args || []).concat(function(r) {
        if(!r || r.status!=='succeeded') reject(new Error('Office read failed'));
        else resolve(r.value);
      }));
    });
  }
  // At most three Office calls in flight: Microsoft documents three simultaneous asynchronous calls
  // for Outlook on the web and new Outlook. `tasks` are functions that start one call each.
  function inThrees(tasks) {
    return new Promise(function(resolve,reject) {
      var out=new Array(tasks.length),next=0,finished=0,failed=false;
      if(!tasks.length) { resolve(out); return; }
      function start() {
        if(failed || next>=tasks.length) return;
        var i=next++;
        Promise.resolve().then(tasks[i]).then(function(v) { out[i]=v; finished++; if(finished===tasks.length) resolve(out); else start(); },
          function(e) { failed=true; reject(e); });
      }
      for(var k=0;k<3;k++) start();
    });
  }
  function person(value) {
    return {name:String(value && value.displayName || ''),address:String(value && value.emailAddress || ''),
      kind:String(value && value.recipientType || '').toLowerCase()==='distributionlist'?'group':'person'};
  }
  function type(value) { var t=String(value || '').toLowerCase();return t==='item'||t==='cloud'?t:'file'; }
  function itemType(item) { return String(item.itemType || '').toLowerCase()==='appointment' || !!item.requiredAttendees ? 'appointment' : 'message'; }
  function composeItem(item) {
    return !!item && (itemType(item)==='appointment' ? !!item.requiredAttendees && typeof item.requiredAttendees.getAsync==='function' && !!item.optionalAttendees && typeof item.optionalAttendees.getAsync==='function' : !!item.to && typeof item.to.getAsync==='function');
  }
  function locationText(value,locations) {
    var text=String(value || '');
    (locations || []).forEach(function(p) { if(p.name && text.indexOf(p.name)<0) text+=(text?'\n':'')+p.name; });
    return text;
  }
  // AppointmentCompose has no resources getter. Room locations (Mailbox 1.8) supply SMTP
  // addresses; required attendees and rooms are To, optional attendees are Cc, never Bcc.
  function readEnvelope(item,profile) {
    var appointment=itemType(item)==='appointment';
    var sender=appointment ? item.organizer : item.from;
    var from=function() { return sender && typeof sender.getAsync==='function' ? call(sender,'getAsync').catch(function(){return profile;}) : Promise.resolve(profile); };
    if(!appointment) return inThrees([from,function(){return call(item.to,'getAsync');},function(){return call(item.cc,'getAsync');},function(){return call(item.bcc,'getAsync');}]).then(function(v) {
      return {itemType:'message',from:person(v[0]),to:(v[1] || []).map(person),cc:(v[2] || []).map(person),bcc:(v[3] || []).map(person)};
    });
    return inThrees([from,function(){return call(item.requiredAttendees,'getAsync');},function(){return call(item.optionalAttendees,'getAsync');},function(){return call(item.enhancedLocation,'getAsync');}]).then(function(v) {
      var to=(v[1] || []).map(person),cc=(v[2] || []).map(person);
      var locations=(v[3] || []).map(function(p) { return {name:String(p.displayName || ''),address:String(p.emailAddress || ''),id:String(p.locationIdentifier && p.locationIdentifier.id || ''),type:String(p.locationIdentifier && p.locationIdentifier.type || '').toLowerCase()}; });
      locations.forEach(function(p) {
        if(p.type!=='room' && !p.address) return;
        // Do not replace a distribution-list entry with a person when deduplicating rooms.
        if(!to.concat(cc).some(function(r){return p.address && r.address.toLowerCase()===p.address.toLowerCase();})) to.push({name:p.name,address:p.address,kind:'person'});
      });
      return {itemType:'appointment',from:person(v[0]),to:to,cc:cc,bcc:[],locations:locations};
    });
  }
  // Outlook on the web's Text coercion runs <div> lines together ("Hi Sam,The portal..."), so an
  // HTML body is read as HTML and checked as the visible text, with the breaks the sender sees.
  function readBody(item) {
    return call(item.body,'getTypeAsync').then(function(format) {
      var html=String(format).toLowerCase()==='html', core=root.DisclosureGateCore;
      if(html && core && typeof core.visibleText==='function') return call(item.body,'getAsync',['html']).then(function(h){return {format:'html',text:core.visibleText(String(h || ''))};});
      return call(item.body,'getAsync',['text']).then(function(t){return {format:html?'html':'text',text:String(t || '')};});
    });
  }
  function readDraft(office,withContent,cache,options) {
    var item=office.context.mailbox.item,profile=office.context.mailbox.userProfile || {};
    return readEnvelope(item,profile).then(function(envelope) {
      var draft=envelope;
      draft.senderEmail=String(profile.emailAddress || '');draft.subject='';draft.location='';draft.body={format:'text',text:''};draft.attachments=[];
      // The mailbox API is the read boundary: do not read the subject, body or files when all are inside.
      var core=root.DisclosureGateCore;
      if(core) {
        var classified=core.classifyDraft(draft,{config:core.runtimeConfig(office,root)});
        if(classified.reach==='inside') return draft;
      }
      var tasks=[function(){return call(item.subject,'getAsync');},function(){return readBody(item);},function(){return call(item,'getAttachmentsAsync');}];
      if(draft.itemType==='appointment') tasks.push(function(){return call(item.location,'getAsync');});
      return inThrees(tasks).then(function(v) {
        draft.subject=String(v[0] || '');draft.body=v[1];
        if(draft.itemType==='appointment') draft.location=locationText(v[3],draft.locations);
        draft.attachments=(v[2] || []).map(function(a){return {id:String(a.id || ''),name:String(a.name || ''),size:a.size,isInline:a.isInline===true,type:type(a.attachmentType),contentType:String(a.contentType || '')};});
        // Read bytes before trusting OCR, including on the release re-read. Inline is never a
        // reason to skip a DOCX, item or archive. Read sequentially to bound temporary memory.
        var reads=Promise.resolve();
        draft.attachments.forEach(function(a) {
          reads=reads.then(function() {
            // Both reads take every readable file's bytes: the release fingerprint binds each file's hash, so
            // a file replaced under the same id, name and size between the check and Send is caught. A
            // failed second read leaves no hash, which fails the comparison and asks again.
            if(a.type!=='file' || !READABLE.test(a.name) && !image(a) || !Number.isSafeInteger(a.size) || a.size<0 || a.size>MAX_BYTES || typeof item.getAttachmentContentAsync!=='function') return;
            return call(item,'getAttachmentContentAsync',[a.id]).then(function(c) {
              if(c && String(c.format).toLowerCase()==='base64' && typeof c.content==='string' && c.content.length<=Math.ceil(MAX_BYTES/3)*4+4) {
                if(withContent) a.content=c.content;
                try { a.contentHash=core.attachmentHash(c.content); } catch(e) {}
              }
            },function(){ /* The local check presents an unread-file finding. */ });
          });
        });
        return reads.then(function() {
          if(!withContent) return draft;
          var service=root.DisclosureGateOcr;
          if(service) return service.prepare(office,draft.attachments).then(function(){
            return service.wait(office,options && options.deadline ? options.deadline-175 : Date.now());
          }).then(function(){service.apply(office,draft.attachments);return draft;});
          // Without the service, leave OCR absent: core presents the unread-picture/failure choice.
          return draft;
        });
      });
    });
  }
  function fingerprint(draft) {
    var value=JSON.stringify([draft.itemType,draft.senderEmail,draft.from,draft.to,draft.cc,draft.bcc,draft.subject,draft.body,draft.location,draft.locations,
      draft.attachments.map(function(a){return [a.id,a.name,a.size,a.isInline,a.type,a.contentType,a.contentHash || null];})]);
    return root.DisclosureGateCore.sha256(value);
  }
  root.DisclosureGateDraft={readDraft:readDraft,readBody:readBody,readEnvelope:readEnvelope,itemType:itemType,composeItem:composeItem,locationText:locationText,inThrees:inThrees,fingerprint:fingerprint,call:call};
})(typeof globalThis!=='undefined'?globalThis:this);
