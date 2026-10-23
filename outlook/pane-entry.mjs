import './polyfills.mjs';
import * as Gate from '../core/gate.mjs';
import * as Config from './config.mjs';
import './draft.js';
import './ocr-service.mjs';
import './taskpane.mjs';
globalThis.DisclosureGateCore={...Gate,...Config};
