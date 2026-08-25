import React from 'react';
import { Contact } from '../../types/contact';
import { Modal } from '../ui/Modal';
import { ContactForm } from './ContactForm';

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (data: Omit<Contact, 'id'>) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
}) => {
  const handleSubmit = (data: Omit<Contact, 'id'>) => {
    onAddContact(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar nuevo contacto"
      description="Los campos marcados con * son obligatorios."
      maxWidth="md"
    >
      <ContactForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
};
