import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App - Contact Management Integration', () => {
  it('renders skeleton on mount and then displays loaded contacts', async () => {
    render(<App />);

    // Initial skeleton state
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for contacts to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Verify contact cards are rendered
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
  });

  it('filters contacts reactively by search term', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    await user.type(searchInput, 'juan');

    // Should match Juan Pérez
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    // Should NOT match María González
    expect(screen.queryByText('María González')).not.toBeInTheDocument();
  });

  it('filters contacts by department chip', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    // Click on "Ventas" chip
    const ventasChip = screen.getByRole('button', { name: 'Ventas' });
    await user.click(ventasChip);

    // María González is in Ventas
    expect(screen.getByText('María González')).toBeInTheDocument();
    // Juan Pérez is in Desarrollo
    expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
  });

  it('shows empty state when no contacts match filters and allows resetting filters', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    await user.type(searchInput, 'NombreInexistente12345');

    expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /Restablecer filtros/i });
    await user.click(resetButton);

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  it('opens modal, validates required fields, and adds a new contact', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    // Click "Nuevo Contacto"
    const addButtons = screen.getAllByRole('button', { name: /Nuevo Contacto/i });
    await user.click(addButtons[0]!);

    // Verify modal is open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Agregar nuevo contacto')).toBeInTheDocument();

    // Fill form inside modal dialog
    const nameInput = within(dialog).getByLabelText(/Nombre completo/i);
    const emailInput = within(dialog).getByLabelText(/Correo electrónico/i);
    const phoneInput = within(dialog).getByLabelText(/Teléfono/i);
    const departmentSelect = within(dialog).getByRole('combobox', { name: /Departamento/i });

    await user.type(nameInput, 'Gonzalo Higuaín');
    await user.type(emailInput, 'gonzalo@empresa.com');
    await user.type(phoneInput, '+54 11 9999-8888');
    await user.selectOptions(departmentSelect, 'Marketing');

    const submitBtn = within(dialog).getByRole('button', { name: /Guardar contacto/i });

    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });

    await user.click(submitBtn);

    // Modal should close and new contact should appear in list
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Gonzalo Higuaín')).toBeInTheDocument();
  });

  it('deletes a contact when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', {
      name: 'Eliminar a Juan Pérez',
    });
    await user.click(deleteBtn);

    // Deletion plays a brief exit animation before the row actually unmounts.
    await waitFor(() => {
      expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
    });
  });
});
