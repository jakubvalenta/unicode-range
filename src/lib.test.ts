import { codesToUnicodeRange } from './lib';
import { expect, test } from 'bun:test';

test('codesToUnicodeRange', () => {
    expect(codesToUnicodeRange(new Set([1]))).toBe('U+0001');
    expect(codesToUnicodeRange(new Set([1, 2, 3]))).toBe('U+0001-0003');
    expect(codesToUnicodeRange(new Set([1, 2, 3, 5]))).toBe('U+0001-0003,U+0005');
    expect(codesToUnicodeRange(new Set([1, 2, 3, 5, 7]))).toBe('U+0001-0003,U+0005,U+0007');
    expect(codesToUnicodeRange(new Set([1, 2, 3, 5, 7, 8, 9, 10, 11, 12]))).toBe('U+0001-0003,U+0005,U+0007-000C');
    expect(codesToUnicodeRange(new Set([12, 11, 10, 9, 8, 7, 5, 3, 2, 1]))).toBe('U+0001-0003,U+0005,U+0007-000C');
});
