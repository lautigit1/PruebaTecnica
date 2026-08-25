import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContactForm } from '../src/components/contacts/ContactForm';

describe('ContactForm', () => {
  it('renders all form fields with submit button initially disabled', async () => {
    render(<ContactForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Departamento/i })).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Guardar contacto/i });
    expect(submitBtn).toBeDisabled();

    // Let Formik's validateOnMount validation settle before the test exits,
    // otherwise the resulting state update fires outside of act().
    await waitFor(() => expect(submitBtn).toBeDisabled());
  });

  it('enables submit button and calls onSubmit when valid values are entered', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ContactForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    const nameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const phoneInput = screen.getByLabelText(/Teléfono/i);
    const departmentSelect = screen.getByRole('combobox', { name: /Departamento/i });

    await user.type(nameInput, 'Luciano Gómez');
    await user.type(emailInput, 'luciano@empresa.com');
    await user.type(phoneInput, '+54 11 4444-5555');
    await user.selectOptions(departmentSelect, 'Ventas');

    const submitBtn = screen.getByRole('button', { name: /Guardar contacto/i });

    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });

    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Luciano Gómez',
        email: 'luciano@empresa.com',
        phone: '+54 11 4444-5555',
        department: 'Ventas',
      });
    });
  });

  it('shows error messages when touched fields are invalid', async () => {
    const user = userEvent.setup();

    render(<ContactForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    await user.type(emailInput, 'correo-invalido');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Ingrese un correo electrónico válido')).toBeInTheDocument();
    });
  });
});
