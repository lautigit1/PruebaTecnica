import { describe, it, expect } from 'vitest';
import { filterContacts, normalizeText } from '../src/utils/filterContacts';
import { Contact } from '../src/types/contact';

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@empresa.com',
    phone: '123456',
    department: 'Desarrollo',
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria@empresa.com',
    department: 'Ventas',
  },
  {
    id: '3',
    name: 'Juan Carlos López',
    email: 'juancarlos@empresa.com',
    department: 'Marketing',
  },
  {
    id: '4',
    name: 'Sofía Martínez',
    email: 'sofia@empresa.com',
    department: 'Soporte',
  },
  {
    id: '5',
    name: 'Lucas Silva',
    email: 'lucas@empresa.com',
    department: 'Desarrollo',
  },
];

describe('normalizeText', () => {
  it('converts to lowercase and trims surrounding whitespace', () => {
    expect(normalizeText('  JUAN PÉREZ  ')).toBe('juan pérez');
  });
});

describe('filterContacts', () => {
  it('returns all contacts when search is empty and department is "Todos"', () => {
    const result = filterContacts(mockContacts, '', 'Todos');
    expect(result).toHaveLength(5);
  });

  describe('search filter by name', () => {
    it('is case-insensitive', () => {
      const resultLower = filterContacts(mockContacts, 'juan', 'Todos');
      const resultUpper = filterContacts(mockContacts, 'JUAN', 'Todos');

      expect(resultLower).toHaveLength(2);
      expect(resultUpper).toHaveLength(2);
      expect(resultLower.map((c) => c.id)).toEqual(['1', '3']);
    });

    it('tolerates leading and trailing spaces in search query', () => {
      const result = filterContacts(mockContacts, '   maría   ', 'Todos');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('María González');
    });

    it('returns empty array when search query matches no contacts', () => {
      const result = filterContacts(mockContacts, 'Inexistente', 'Todos');
      expect(result).toHaveLength(0);
    });
  });

  describe('department filter', () => {
    it('filters strictly by specified department', () => {
      const result = filterContacts(mockContacts, '', 'Desarrollo');
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.department === 'Desarrollo')).toBe(true);
    });

    it('returns single department matching contacts', () => {
      const result = filterContacts(mockContacts, '', 'Soporte');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Sofía Martínez');
    });
  });

  describe('combined filters (search + department)', () => {
    it('applies both search and department simultaneously (logical AND)', () => {
      // "Juan" exists in Desarrollo (id 1) and Marketing (id 3)
      const result = filterContacts(mockContacts, 'juan', 'Desarrollo');
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
      expect(result[0]?.name).toBe('Juan Pérez');
    });

    it('returns empty array if search matches but department does not', () => {
      const result = filterContacts(mockContacts, 'María', 'Soporte');
      expect(result).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty input contacts array gracefully', () => {
      const result = filterContacts([], 'juan', 'Todos');
      expect(result).toEqual([]);
    });

    it('handles whitespace-only search string as empty search', () => {
      const result = filterContacts(mockContacts, '    ', 'Todos');
      expect(result).toHaveLength(5);
    });
  });
});
