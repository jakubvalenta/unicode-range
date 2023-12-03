import { getCodes, codesToUnicodeRange } from './lib';
import './style.css';
import { parse } from 'opentype.js';

document.body.classList.remove('no-js');

const pathEl = document.querySelector<HTMLInputElement>('#path')!;
const unicodeRangeEl = document.querySelector<HTMLInputElement>('#unicode-range')!;
const errorEl = document.querySelector<HTMLInputElement>('#error')!;

errorEl.textContent = '';

pathEl.addEventListener('change', async () => {
    if (!pathEl.files?.length) {
        return;
    }
    try {
        const ab = await pathEl.files[0].arrayBuffer();
        const font = parse(ab);
        const codes = getCodes(font);
        const unicodeRange = codesToUnicodeRange(codes);
        unicodeRangeEl.textContent = unicodeRange;
    } catch (err) {
        errorEl.textContent = (err as Error).message;
    }
});
