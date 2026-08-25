/**
 * Generates a RFC 4122 compliant UUID v4 string.
 * Uses native web crypto API when available, with a robust cryptographically secure fallback.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback using crypto.getRandomValues for environments where randomUUID is not present
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version to 0100 (UUID v4)
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    // Set variant to 10xx (RFC 4122)
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  throw new Error('Cryptographically secure random number generator is unavailable.');
}
