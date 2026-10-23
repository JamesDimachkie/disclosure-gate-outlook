export const CONFIG=Object.freeze({internalDomains:['northline.example']});
export const JOHN={name:'John Reyes',address:'john@northline.example'};
export const KATE={name:'Kate Morgan',address:'kate@northline.example',kind:'person'};
export const DAN={name:'Dan Whitfield',address:'dan@whitfielddev.example',kind:'person'};
export const DEMO_BODY="Kate — North Hall's tracking triple the margin we bid. If Dan pushes on CO 12, we've got room.";
export const CLEAN_BODY="Kate — let's walk CO 12 together before Dan's call on Friday.";
export const draft=(extra={})=>({from:JOHN,to:[KATE],cc:[DAN],bcc:[],subject:'North Hall: CO 12',body:{text:DEMO_BODY,format:'html'},attachments:[],...extra});
// A real 1x1 PNG, for tests where a picture must prove it is one.
export const PNG_B64='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
export const PNG_SIZE=70;
