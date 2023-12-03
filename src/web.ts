import { codeToHex, codesToUnicodeRange, getCodes } from './lib';
import './style.css';
import { parse } from 'opentype.js';

document.body.classList.remove('no-js');

const pathEl = document.querySelector<HTMLInputElement>('#path')!;
const unicodeRangeEl = document.querySelector<HTMLInputElement>('#unicode-range')!;
const unicodeBlocksEl = document.querySelector<HTMLInputElement>('#unicode-blocks')!;
const errorEl = document.querySelector<HTMLInputElement>('#error')!;

errorEl.textContent = '';

pathEl.addEventListener('change', async () => {
    if (!pathEl.files?.length) {
        return;
    }
    try {
        errorEl.textContent = '';

        const ab = await pathEl.files[0].arrayBuffer();
        const fontFace = new FontFace('test-font', ab);
        const documentFonts = document.fonts as unknown as Set<FontFace>;
        documentFonts.clear();
        documentFonts.add(fontFace);
        await fontFace.load();

        const font = parse(ab);
        const codes = getCodes(font);

        unicodeRangeEl.textContent = codesToUnicodeRange(codes);

        const blocks = new Set<number>();
        codes.forEach((code) => blocks.add(Math.trunc(code / 128)));
        unicodeBlocksEl.innerHTML = '';
        blocks.forEach((block) => {
            const blockEl = document.createElement('div');
            blockEl.classList.add('block');
            for (let code = block * 128; code < (block + 1) * 128; code++) {
                const glyphEl = document.createElement('div');
                glyphEl.classList.add('glyph');
                if (codes.has(code)) {
                    glyphEl.classList.add('exists');
                    glyphEl.textContent = String.fromCodePoint(code);
                    glyphEl.title = `U+${codeToHex(code)}`;
                    glyphEl.style.fontFamily = 'test-font';
                }
                blockEl.appendChild(glyphEl);
            }
            unicodeBlocksEl.appendChild(blockEl);
        });
    } catch (err) {
        console.error(err);
        errorEl.textContent = (err as Error).message;
    }
});
