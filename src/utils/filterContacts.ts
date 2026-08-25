import { ALL_DEPARTMENTS } from '../constants/departments';
import { Contact, DepartmentFilter } from '../types/contact';

/**
 * Normalizes a string by trimming and converting to lower case for resilient matching.
 */
export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

/**
 * Filters a list of contacts based on a search term (matching against name) and selected department.
 * Both conditions are combined using logical AND.
 */
export function filterContacts(
  contacts: readonly Contact[],
  searchTerm: string,
  selectedDepartment: DepartmentFilter
): Contact[] {
  const normalizedSearch = normalizeText(searchTerm);

  return contacts.filter((contact) => {
    const matchesSearch =
      normalizedSearch === '' || normalizeText(contact.name).includes(normalizedSearch);

    const matchesDepartment =
      selectedDepartment === ALL_DEPARTMENTS || contact.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });
}
