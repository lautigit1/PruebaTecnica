import { useState, useEffect, useCallback } from 'react';
import { Contact } from '../types/contact';
import initialContactsData from '../data/data.json';
import { generateUUID } from '../utils/id';

export interface UseContactsResult {
  contacts: Contact[];
  isLoading: boolean;
  addContact: (data: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
}

export function useContacts(): UseContactsResult {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize contacts with a realistic initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(initialContactsData as Contact[]);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const addContact = useCallback((data: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...data,
      id: generateUUID(),
    };

    setContacts((prev) => [newContact, ...prev]);
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }, []);

  return {
    contacts,
    isLoading,
    addContact,
    deleteContact,
  };
}
