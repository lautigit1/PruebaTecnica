import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { DepartmentFilter, Contact } from '../../types/contact';
import { DEPARTMENTS, ALL_DEPARTMENTS } from '../../constants/departments';

export interface ContactFiltersProps {
  search: string;
  selectedDepartment: DepartmentFilter;
  filteredCount: number;
  totalCount: number;
  contacts?: Contact[];
  isLoading?: boolean;
  onSearchChange: (search: string) => void;
  onDepartmentChange: (department: DepartmentFilter) => void;
}

const filterOptions: readonly DepartmentFilter[] = [ALL_DEPARTMENTS, ...DEPARTMENTS];

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  search,
  selectedDepartment,
  filteredCount,
  totalCount,
  contacts = [],
  isLoading = false,
  onSearchChange,
  onDepartmentChange,
}) => {
  // Compute department counts for instant visual scanning
  const countsByDepartment = useMemo(() => {
    const counts: Record<string, number> = {
      [ALL_DEPARTMENTS]: contacts.length,
    };
    for (const dept of DEPARTMENTS) {
      counts[dept] = 0;
    }
    for (const c of contacts) {
      if (c.department in counts) {
        counts[c.department] = (counts[c.department] ?? 0) + 1;
      }
    }
    return counts;
  }, [contacts]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && search) {
      e.stopPropagation();
      onSearchChange('');
    }
  };

  const counterText = isLoading
    ? 'Cargando directorio…'
    : filteredCount === totalCount
      ? `${totalCount} ${totalCount === 1 ? 'contacto' : 'contactos'}`
      : `${filteredCount} de ${totalCount} contactos`;

  return (
    <section aria-label="Filtros" className="flex flex-col gap-3">
      {/* Top row: Search input + dynamic counter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 grow basis-[240px] sm:max-w-[380px]">
          <label htmlFor="contact-search" className="sr-only">
            Buscar contacto por nombre
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          <input
            id="contact-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre"
            className="h-10 w-full rounded-lg border border-line-strong bg-surface pl-[34px] pr-10 text-sm text-ink-900 touch-manipulation transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-ink-300 hover:border-[#BEB9AE] focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
          />

          {/* Shortcut hint or clear button */}
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 touch-manipulation transition-colors hover:bg-line-soft hover:text-ink-900 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/20"
            >
              <X className="h-[13px] w-[13px]" aria-hidden="true" />
            </button>
          ) : (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden select-none rounded border border-line bg-paper px-1.5 py-0.5 text-[11px] font-medium text-ink-400 sm:inline-flex"
            >
              /
            </span>
          )}
        </div>

        {/* Counter */}
        <p
          className="ml-auto shrink-0 text-xs font-medium text-ink-500"
          aria-live="polite"
        >
          {counterText}
        </p>
      </div>

      {/* Bottom row: Department chips with counts */}
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filtrar por departamento"
      >
        {filterOptions.map((department) => {
          const isSelected = selectedDepartment === department;
          const count = countsByDepartment[department] ?? 0;

          return (
            <button
              key={department}
              type="button"
              aria-label={department}
              aria-pressed={isSelected}
              onClick={() => onDepartmentChange(department)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium touch-manipulation transition-[color,background-color,border-color,transform] duration-150 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/20 active:scale-[0.97] ${
                isSelected
                  ? 'border-accent bg-accent text-[#FDFCFA] hover:border-accent-dark hover:bg-accent-dark'
                  : 'border-line bg-surface text-ink-500 hover:border-line-strong hover:bg-[#F5F3EE] hover:text-ink-900'
              }`}
            >
              <span>{department}</span>
              <span
                className={`text-xs ${
                  isSelected
                    ? 'text-[#FDFCFA]/80 font-normal'
                    : 'text-ink-300 font-normal'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
