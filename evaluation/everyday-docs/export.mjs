// HTML -> Chromium PDF; Word converts the same HTML to .docx and PDF through export-word.ps1.
import { readdirSync, mkdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
const arg = n => process.argv.find(x => x.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const { chromium } = await import(pathToFileURL(arg('playwright')).href);
const dir = fileURLToPath(new URL('./', import.meta.url));
mkdirSync(dir + 'files', { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: arg('chromium') });
const page = await browser.newPage();
for (const f of readdirSync(dir + 'html')) {
  await page.goto(pathToFileURL(dir + 'html/' + f).href);
  await page.pdf({ path: dir + 'files/' + f.replace('.html', '.chromium.pdf'), format: 'A4' });
}
await browser.close();
console.log('chromium done');
