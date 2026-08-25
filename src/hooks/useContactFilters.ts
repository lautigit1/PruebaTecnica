import { useState, useMemo, useCallback } from 'react';
import { Contact, DepartmentFilter } from '../types/contact';
import { ALL_DEPARTMENTS } from '../constants/departments';
import { filterContacts } from '../utils/filterContacts';

export interface UseContactFiltersResult {
  search: string;
  selectedDepartment: DepartmentFilter;
  filteredContacts: Contact[];
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  setSearch: (search: string) => void;
  setSelectedDepartment: (department: DepartmentFilter) => void;
  resetFilters: () => void;
}

export function useContactFilters(contacts: Contact[]): UseContactFiltersResult {
  const [search, setSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentFilter>(ALL_DEPARTMENTS);

  const filteredContacts = useMemo(() => {
    return filterContacts(contacts, search, selectedDepartment);
  }, [contacts, search, selectedDepartment]);

  const hasActiveFilters = useMemo(() => {
    return search.trim() !== '' || selectedDepartment !== ALL_DEPARTMENTS;
  }, [search, selectedDepartment]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setSelectedDepartment(ALL_DEPARTMENTS);
  }, []);

  return {
    search,
    selectedDepartment,
    filteredContacts,
    totalCount: contacts.length,
    filteredCount: filteredContacts.length,
    hasActiveFilters,
    setSearch,
    setSelectedDepartment,
    resetFilters,
  };
}
