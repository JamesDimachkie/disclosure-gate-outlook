// This entry is referenced only by browser HTML, never by the classic event runtime.
import { createModelService } from './model-service.mjs';
globalThis.GuardcellSemantic = createModelService(globalThis, __DG_MODEL_MANIFEST__);
