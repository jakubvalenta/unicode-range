import { codeToHex, codesToUnicodeRange, getCodes } from './lib';
import './style.css';
import { parse } from 'opentype.js';

async function loadFont(el: HTMLInputElement): Promise<Set<number> | undefined> {
    if (!el.files?.length) {
        return undefined;
    }
    const ab = await el.files[0].arrayBuffer();
    const fontFace = new FontFace('test-font', ab);
    const documentFonts = document.fonts as unknown as Set<FontFace>;
    documentFonts.clear();
    documentFonts.add(fontFace);
    await fontFace.load();
    const font = parse(ab);
    return getCodes(font);
}

function updateUnicodeRange(codes: Set<number>, codesExclude?: Set<number>) {
    let codesWithoutExcluded = new Set(codes);
    if (codesExclude) {
        codesExclude.forEach((x) => codesWithoutExcluded.delete(x));
    }

    const unicodeRangeEl = document.querySelector<HTMLInputElement>('#unicode-range')!;
    unicodeRangeEl.textContent = codesToUnicodeRange(codesWithoutExcluded);

    const unicodeBlocksEl = document.querySelector<HTMLInputElement>('#unicode-blocks')!;
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
                glyphEl.classList.add('included');
                glyphEl.textContent = String.fromCodePoint(code);
                glyphEl.title = `U+${codeToHex(code)}`;
                glyphEl.style.fontFamily = 'test-font';
                if (codesExclude && codesExclude.has(code)) {
                    glyphEl.classList.add('excluded');
                    glyphEl.title += ' excluded';
                }
            }
            blockEl.appendChild(glyphEl);
        }
        unicodeBlocksEl.appendChild(blockEl);
    });
    document.body.classList.add('done');
}

async function handleErrors(errorEl: HTMLElement, func: () => Promise<void>) {
    try {
        errorEl.textContent = '';
        await func();
    } catch (err) {
        console.error(err);
        errorEl.textContent = (err as Error).message;
    }
}

function main() {
    const errorEl = document.querySelector<HTMLElement>('#error')!;
    errorEl.textContent = '';

    document.querySelector<HTMLFormElement>('form')!.reset();

    const pathEl = document.querySelector<HTMLInputElement>('#path')!;
    const excludeEl = document.querySelector<HTMLInputElement>('#exclude')!;

    let codes: Set<number> | undefined;
    let codesExclude: Set<number> | undefined;

    pathEl.addEventListener('change', async () => {
        await handleErrors(errorEl, async () => {
            codes = await loadFont(pathEl);
            if (!codes) {
                return;
            }
            updateUnicodeRange(codes);
            pathEl.classList.add('included');
            excludeEl.classList.remove('excluded');
            excludeEl.value = '';
        });
    });
    excludeEl.addEventListener('change', async () => {
        await handleErrors(errorEl, async () => {
            codesExclude = await loadFont(excludeEl);
            if (!codes || !codesExclude) {
                return;
            }
            updateUnicodeRange(codes, codesExclude);
            pathEl.classList.add('included');
            excludeEl.classList.add('excluded');
        });
    });
}

main();
