/**
 * Swedish postal code (postnummer) validation and formatting.
 * Format: 5 digits, optionally with space (123 45 or 12345).
 * Valid range: 100 00 – 999 99.
 */

/** Strip spaces and return digits only */
export function normalizePostalCode(value: string): string {
  return value.replace(/\s/g, "").replace(/\D/g, "");
}

/** Format as "123 45" (space after 3rd digit) */
export function formatPostalCode(value: string): string {
  const digits = normalizePostalCode(value);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

/** Validate Swedish postal code (5 digits, 10000–99999) */
export function isValidPostalCode(value: string): boolean {
  const digits = normalizePostalCode(value);
  if (digits.length !== 5) return false;
  const num = parseInt(digits, 10);
  return num >= 10000 && num <= 99999;
}

/** Format input as user types (max 5 digits, add space after 3rd) */
export function formatPostalCodeInput(value: string): string {
  const digits = normalizePostalCode(value).slice(0, 5);
  return formatPostalCode(digits);
}
