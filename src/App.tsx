import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Check, Trash2, X } from 'lucide-react';
import { useContacts } from './hooks/useContacts';
import { useContactFilters } from './hooks/useContactFilters';
import { ContactFilters } from './components/contacts/ContactFilters';
import { ContactList } from './components/contacts/ContactList';
import { ContactModal } from './components/contacts/ContactModal';
import { Button } from './components/ui/Button';
import { Contact } from './types/contact';

type Toast = {
  id: number;
  message: string;
  type: 'success' | 'delete';
};

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const { contacts, isLoading, addContact, deleteContact } = useContacts();

  const {
    search,
    selectedDepartment,
    filteredContacts,
    totalCount,
    filteredCount,
    setSearch,
    setSelectedDepartment,
    resetFilters,
  } = useContactFilters(contacts);

  const showToast = useCallback((message: string, type: 'success' | 'delete') => {
    const id = Date.now();
    setToast({ id, message, type });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

  const handleAddContact = useCallback(
    (data: Omit<Contact, 'id'>) => {
      addContact(data);
      showToast(`Contacto "${data.name}" agregado`, 'success');
    },
    [addContact, showToast]
  );

  const handleDeleteContact = useCallback(
    (id: string) => {
      const contactToDelete = contacts.find((c) => c.id === id);
      deleteContact(id);
      if (contactToDelete) {
        showToast(`Contacto "${contactToDelete.name}" eliminado`, 'delete');
      }
    },
    [contacts, deleteContact, showToast]
  );

  // Global keyboard shortcuts: '/' or '⌘K' for search, 'n' or 'N' for new contact
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive =
        activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (isInputActive) return;

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        const searchInput = document.getElementById('contact-search');
        searchInput?.focus();
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-paper text-ink-900 flex flex-col justify-between">
      <div>
        {/* Header: identity, context, primary action */}
        <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Directorio interno
              </span>
              <h1 className="text-xl font-semibold leading-tight tracking-[-0.012em] text-ink-900">
                Contactos
              </h1>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              Nuevo contacto
            </Button>
          </div>
        </header>

        <main className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-8">
          <ContactFilters
            search={search}
            selectedDepartment={selectedDepartment}
            filteredCount={filteredCount}
            totalCount={totalCount}
            contacts={contacts}
            isLoading={isLoading}
            onSearchChange={setSearch}
            onDepartmentChange={setSelectedDepartment}
          />

          <ContactList
            contacts={filteredContacts}
            isLoading={isLoading}
            totalCount={totalCount}
            onDelete={handleDeleteContact}
            onOpenAddModal={() => setIsModalOpen(true)}
            onResetFilters={resetFilters}
          />
        </main>
      </div>

      {/* Subtle toast feedback */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="animate-toast fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-xs font-medium text-ink-900 shadow-dialog"
        >
          {toast.type === 'success' ? (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
            </span>
          ) : (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger-tint text-danger">
              <Trash2 className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
            </span>
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
            className="ml-1 rounded p-0.5 text-ink-300 hover:text-ink-900 focus:outline-none"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </aside>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddContact={handleAddContact}
      />
    </div>
  );
};

export default App;
