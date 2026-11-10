export type ByteRange = { start: number; end: number };
export function parseRange(value: string | null, size: number): ByteRange | 'invalid' | undefined {
  if (!value) return undefined;
  const m = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!m || (!m[1] && !m[2]) || size < 1) return 'invalid';
  if (!m[1]) {
    const suffix = Number(m[2]); if (!suffix) return 'invalid';
    return { start: Math.max(0, size - suffix), end: size - 1 };
  }
  const start = Number(m[1]), end = m[2] ? Number(m[2]) : size - 1;
  return !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size
    ? 'invalid' : { start, end: Math.min(end, size - 1) };
}
