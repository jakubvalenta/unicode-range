function codeToHex(code: number): string {
    return code.toString(16).toUpperCase().padStart(4, '0');
}

export function codesToUnicodeRange(codes: Set<number>): string {
    const ranges: Array<[number, number]> = [];
    for (const code of Array.from(codes).sort((a, b) => a - b)) {
        if (ranges[ranges.length - 1]?.[1] === code - 1) {
            ranges[ranges.length - 1][1] = code;
        } else {
            ranges.push([code, code]);
        }
    }
    return ranges
        .map(([start, end]) => `U+${codeToHex(start)}` + (start !== end ? `-${codeToHex(end)}` : ''))
        .join(',');
}
