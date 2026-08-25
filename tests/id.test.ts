import { describe, it, expect } from 'vitest';
import { generateUUID } from '../src/utils/id';

describe('generateUUID', () => {
  it('generates a valid RFC 4122 v4 UUID format', () => {
    const uuid = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('generates distinct IDs on consecutive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateUUID()));
    expect(ids.size).toBe(50);
  });
});
