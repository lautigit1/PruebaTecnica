import React from 'react';
import { Contact } from '../../types/contact';
import { ContactCard } from './ContactCard';
import { ContactListSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

export interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  totalCount: number;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isLoading,
  totalCount,
  onDelete,
  onOpenAddModal,
  onResetFilters,
}) => {
  if (isLoading) {
    return <ContactListSkeleton count={6} />;
  }

  return (
    <section
      aria-label="Lista de contactos"
      className="overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_1px_2px_rgba(27,26,23,0.04)]"
    >
      {/* Column Headers for structured reading on desktop */}
      {contacts.length > 0 && (
        <div
          aria-hidden="true"
          className="hidden sm:flex items-center gap-x-3 border-b border-line bg-[#FAF9F6] pl-5 pr-[52px] py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400 select-none"
        >
          <span className="min-w-0 shrink grow basis-[170px]">Nombre</span>
          <span className="min-w-0 shrink grow basis-[196px]">Correo</span>
          <span className="min-w-0 shrink basis-[128px]">Teléfono</span>
          <span className="shrink-0 basis-[116px]">Departamento</span>
        </div>
      )}

      {totalCount === 0 && (
        <EmptyState
          type="no-contacts"
          onAction={onOpenAddModal}
          actionLabel="Agregar primer contacto"
        />
      )}

      {totalCount > 0 && contacts.length === 0 && (
        <EmptyState
          type="no-results"
          totalCount={totalCount}
          onAction={onResetFilters}
          actionLabel="Restablecer filtros"
        />
      )}

      {contacts.map((contact, index) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </section>
  );
};
