import { codesToUnicodeRange } from './utils';
import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { parse, type Glyph } from 'opentype.js';

/**
 * Copied from opentype.js, because we can't import opentype.js/src/util.js, because it misses type declarations.
 *
 * @see https://github.com/opentypejs/opentype.js/blob/10563b50d0dcd25cd78f6ea16287b810dd9f7523/src/util.js#L9-L17
 */
function nodeBufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

async function readCodesFromFontFile(path: string): Promise<Set<number>> {
    const font = parse(nodeBufferToArrayBuffer(await readFile(path)));
    const glyphs = (font.glyphs as unknown as { glyphs: Glyph[] }).glyphs;
    return new Set(
        Object.values(glyphs)
            .map((glyph) => glyph.unicode)
            .filter(Boolean) as number[],
    );
}

async function main() {
    new Command()
        .name('unicode-range')
        .description('Generate the CSS property unicode-range from a TTF, OTF or WOFF font.')
        .showHelpAfterError()
        .argument('<path>', 'path to a TTF, OTF or WOFF file')
        .option('--exclude <path>', 'exclude glyphs included in another TTF, OTF or WOFF file')
        .action(async (path, options) => {
            const codes = await readCodesFromFontFile(path);
            if (options.exclude) {
                const codesExclude = await readCodesFromFontFile(options.exclude);
                codesExclude.forEach((x) => codes.delete(x));
            }
            process.stdout.write(codesToUnicodeRange(codes) + '\n');
        })
        .parse();
}

main().catch(console.error);
