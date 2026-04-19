/** Validates a 'YYYY-MM-DD' string and returns it if it's a real date. */
export function parseDateInput(input: string): { value: string | null; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { value: null, error: null };
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) return { value: null, error: 'Use YYYY-MM-DD.' };
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  const valid =
    date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
  if (!valid) return { value: null, error: 'That date doesn’t exist.' };
  return { value: trimmed, error: null };
}

export function parseDailyCost(input: string): { value: number | null; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { value: null, error: null };
  const cleaned = trimmed.replace(/^\$/, '').replace(/,/g, '');
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return { value: null, error: 'Enter a positive amount.' };
  if (n > 9999.99) return { value: null, error: 'Keep it under $10,000.' };
  return { value: Math.round(n * 100) / 100, error: null };
}
