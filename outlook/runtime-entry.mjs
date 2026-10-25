import './polyfills.mjs';
import * as Gate from '../core/gate.mjs';
import * as Config from './config.mjs';
import './draft.js';
import './ocr-service.mjs';
import './handler.js';
// No work is deferred to onReady: classic Outlook skips its callback for event handlers.
globalThis.GuardcellCore = { ...Gate, ...Config };
