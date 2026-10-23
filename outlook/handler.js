/* OnMessageSend and OnAppointmentSend, shared by the HTML and JavaScript-only runtimes.
   No transport. Every event completes once; Clear requires an unchanged re-read. */
(function(root) {
  'use strict';
  var COMMAND_ID = 'dgOpenPane';
  var MEETING_COMMAND_ID = 'dgOpenMeetingPane';
  var DEADLINE_MS = 4500;
  function run(event, deps) {
    var completed=false, timer, first, started=Date.now();
    var fingerprint=deps.fingerprint || root.DisclosureGateDraft.fingerprint;
    var core=root.DisclosureGateCore, config;
    try { config=deps.config ? deps.config() : {findings:'hold',failures:'hold'}; } catch(e) { config={findings:'hold',failures:'hold'}; }
    function supports(version) { try { return version==='1.14' ? deps.reviewButton() : !!(deps.markdown && deps.markdown()); } catch(e) { return false; } }
    function describe(result) {
      return core.describeResult(Object.assign({},result,{itemType:deps.itemType || first && first.itemType || result.itemType}),config,{canOverride:supports('1.14'),reviewButton:supports('1.14')});
    }
    function optionsFor(result, custom) {
      var options={allowEvent:false,errorMessage:custom ? result.message : result.fallbackMessage};
      if(supports('1.14') && result.outcome==='ask') options.sendModeOverride='promptUser';
      var hasFindings=(result.findings || []).some(function(f){return f.category!=='attachment' || f.severity==='prompt';});
      if(custom && supports('1.14') && hasFindings) { options.cancelLabel=core.STRINGS.dialog.review;options.commandId=deps.commandId || COMMAND_ID; }
      if(custom && supports('1.15')) options.errorMessageMarkdown=result.markdown;
      return options;
    }
    function finish(options, phase, result, fallback) {
      if(completed) return;
      completed=true; clearTimeout(timer);
      var phaseWrite;
      try { phaseWrite=deps.phase(phase,result,first); } catch(e) {}
      function complete() {
      // Some clients reject customization options; only a rejected call gets a plain retry.
      try { event.completed(options); } catch(e) {
        var retryResult=result || describe({state:'unavailable',reason:'error',findings:[]});
        if(options.allowEvent) { retryResult=describe({state:'unavailable',reason:'error',findings:[]});try { deps.phase('unavailable',retryResult,first); } catch(ignored) {} }
        try { event.completed(fallback || optionsFor(retryResult,false)); } catch(ignored) {
          // If the override itself was rejected, use the installed mode and matching plain copy.
          var basic=core.describeResult(retryResult,config,{canOverride:false,reviewButton:false,itemType:deps.itemType || first && first.itemType});
          try { deps.phase(basic.state,basic,first); } catch(ignoredPhase) {}
          try { event.completed({allowEvent:false,errorMessage:basic.fallbackMessage}); } catch(ignoredPlain) {}
        }
      }
      }
      // Persist held results before Review, bounded by the event deadline.
      if(!options.allowEvent && phaseWrite && typeof phaseWrite.then==='function') {
        return new Promise(function(resolve) {
          var called=false,wait=setTimeout(done,Math.max(0,(deps.deadlineMs || DEADLINE_MS)-(Date.now()-started)));
          function done() { if(called) return;called=true;clearTimeout(wait);complete();resolve(); }
          phaseWrite.then(done,done);
        });
      }
      complete();
    }
    function unavailable(reason) {
      if(completed) return;
      if(typeof reason!=='string') reason='error';
      try { if(deps.pending && deps.pending()) reason='ocr_pending'; } catch(e) {}
      var result=describe({state:'unavailable',reason:reason,findings:[]});
      return finish(optionsFor(result,true),'unavailable',result,optionsFor(result,false));
    }
    function late() { return completed || Date.now()-started >= (deps.deadlineMs || DEADLINE_MS); }
    timer=setTimeout(function(){unavailable('timeout');},deps.deadlineMs || DEADLINE_MS);
    try { var checking=deps.phase('checking');if(checking && typeof checking.catch==='function') checking.catch(function(){}); } catch(e) {}
    return Promise.resolve().then(function(){return deps.read(true,{deadline:started+(deps.deadlineMs || DEADLINE_MS)});}).then(function(draft) {
      if(late()) { unavailable('timeout');return null; }
      first=draft;return deps.check(draft,{deadline:started+(deps.deadlineMs || DEADLINE_MS)});
    }).then(function(result) {
      if(completed) return;
      if(late()) return unavailable('timeout');
      if(!result || typeof result!=='object') return unavailable('error');
      if((result.state==='held' && Array.isArray(result.findings) && result.findings.length) || result.state==='too_large' || result.state==='unavailable') {
        result=describe(result);
        return finish(optionsFor(result,true),result.state,result,optionsFor(result,false));
      }
      if(result.state!=='clear') return unavailable();
      return deps.read(false).then(function(second) {
        if(completed) return;
        if(late()) return unavailable('timeout');
        if(fingerprint(second)!==fingerprint(first)) return unavailable('changed');
        finish({allowEvent:true},'clear',result);
      });
    }).catch(function(){return unavailable(first?'error':'read');});
  }
  function setPhase(office,phase,result,draft) {
    var data=office.context.mailbox.item.sessionData;
    if(!data || typeof data.setAsync!=='function') return;
    var at=Date.now(), full=result && draft ? JSON.stringify({at:at,result:result,fingerprint:root.DisclosureGateDraft.fingerprint(draft)}) : '';
    // A read/timeout failure may have no draft to bind. Keep its reason in the phase for the pane.
    var mark=JSON.stringify({phase:phase,at:at,binding:result && result.binding || null,result:result && (phase==='unavailable' || phase==='too_large') ? result : null});
    return new Promise(function(resolve) {
      var write=function(){data.setAsync('dg-phase',mark,function(){});resolve();};
      // Reserve 12k for OCR plus phase/keys within the older 50k session-data allowance.
      if(full && full.length<28000) data.setAsync('dg-result',full,write);
      else if(result && draft) data.setAsync('dg-result',JSON.stringify({at:at,fingerprint:root.DisclosureGateDraft.fingerprint(draft),result:{state:result.state,binding:result.binding},recheck:true}),write);
      else { data.setAsync('dg-phase',mark,function(){});resolve(); }
    });
  }
  function onMessageSendHandler(event) {
    var office=root.Office;
    var itemType=root.DisclosureGateDraft.itemType(office.context.mailbox.item);
    return run(event,{
      itemType:itemType,commandId:itemType==='appointment'?MEETING_COMMAND_ID:COMMAND_ID,
      config:function(){return coreConfig();},
      read:function(content,options){return root.DisclosureGateDraft.readDraft(office,content,null,options);},
      pending:function(){return root.DisclosureGateOcr && root.DisclosureGateOcr.pending(office);},
      check:function(draft,options) {
        // Reserve 500 ms for the unchanged-draft re-read and result persistence. The core
        // calculates the remaining model budget after the mandatory rules have finished.
        var semanticDeadline=options.deadline-500, semantic;
        var config=root.DisclosureGateCore.runtimeConfig(office,root);
        try { if(root.DisclosureGateSemantic && config.model==='on') semantic=root.DisclosureGateSemantic.forSend(semanticDeadline); } catch(e) {}
        return root.DisclosureGateCore.checkDraft(draft,{
          config:config,semantic:semantic,semanticBudgetMs:1500,semanticDeadline:semanticDeadline
        });
      },
      reviewButton:function(){try{return office.context.requirements.isSetSupported('Mailbox','1.14');}catch(e){return false;}},
      markdown:function(){try{return office.context.requirements.isSetSupported('Mailbox','1.15');}catch(e){return false;}},
      phase:function(phase,result,draft){return setPhase(office,phase,result,draft);}
    });
    function coreConfig(){return root.DisclosureGateCore.runtimeConfig(office,root);}
  }
  if(root.Office && root.Office.actions) {
    root.Office.actions.associate('onMessageSendHandler',onMessageSendHandler);
    root.Office.actions.associate('onAppointmentSendHandler',onMessageSendHandler);
  }
  // Preserve the handshake observed live on the web on 27 September 2026.
  if(root.Office && typeof root.Office.onReady==='function') root.Office.onReady();
  root.DisclosureGateHandler={run:run,COMMAND_ID:COMMAND_ID};
})(typeof globalThis!=='undefined'?globalThis:this);
