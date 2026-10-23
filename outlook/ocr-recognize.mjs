import { ocrStats, decideOcr } from '../core/ocr-policy.mjs';
import { binaryEvidence } from '../core/ocr-pixels.mjs';
export async function readImage(worker, bytes) {
  const reads = [];
  // Sparse text finds scattered labels/screenshots; single block provides a second read and
  // makes text missed by sparse segmentation an uncertain image instead of a blank clearance.
  for (const psm of ['11', '6']) {
    await worker.setParameters({ tessedit_pageseg_mode: psm, preserve_interword_spaces: '1' });
    const result = await worker.recognize(bytes, { rotateAuto: true }, { text: true, tsv: true, imageBinary: true });
    reads.push({ ...ocrStats(result.data), pixels: binaryEvidence(result.data.imageBinary) });
  }
  return { reads, ...decideOcr(reads) };
}
