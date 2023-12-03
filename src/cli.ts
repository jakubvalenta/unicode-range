import { codesToUnicodeRange, getCodes } from './lib';
import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { parse } from 'opentype.js';

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
    return getCodes(font);
}

async function main() {
    new Command()
        .name('unicode-range')
        .description('Generate the CSS property unicode-range from a TTF, OTF or WOFF font.')
        .showHelpAfterError()
        .argument('<path>', 'path to a TTF, OTF or WOFF file')
        .option('--exclude <path>', 'exclude glyphs from another TTF, OTF or WOFF file')
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
