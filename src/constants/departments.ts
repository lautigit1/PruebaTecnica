/**
 * Single source of truth for allowed company departments.
 */
export const DEPARTMENTS = ['Ventas', 'Desarrollo', 'Marketing', 'Soporte'] as const;

/**
 * Filter option representing all departments.
 */
export const ALL_DEPARTMENTS = 'Todos' as const;

/**
 * Muted, equal-weight department colors: they differentiate without competing
 * with the primary accent or the contact name.
 */
export const DEPARTMENT_COLORS = {
  Ventas: {
    badge: 'bg-[#F5EFDF] text-[#7A5B12]',
    dot: 'bg-[#7A5B12]',
  },
  Desarrollo: {
    badge: 'bg-[#E8EDF6] text-[#2C4A7A]',
    dot: 'bg-[#2C4A7A]',
  },
  Marketing: {
    badge: 'bg-[#F3E9F1] text-[#6D2F5B]',
    dot: 'bg-[#6D2F5B]',
  },
  Soporte: {
    badge: 'bg-[#E7F0E9] text-[#2F6B3A]',
    dot: 'bg-[#2F6B3A]',
  },
} as const;
