import { describe, it, expect } from 'vitest';
import { contactValidationSchema } from '../src/schemas/contactSchema';

describe('contactValidationSchema', () => {
  const validContact = {
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    phone: '+54 11 4521-8890',
    department: 'Desarrollo',
  };

  it('validates a correct contact payload successfully', async () => {
    await expect(contactValidationSchema.validate(validContact)).resolves.toEqual(
      validContact
    );
  });

  it('accepts a contact without phone number (optional field)', async () => {
    const contactWithoutPhone = {
      name: 'María González',
      email: 'maria@empresa.com',
      phone: '',
      department: 'Ventas',
    };

    await expect(
      contactValidationSchema.validate(contactWithoutPhone)
    ).resolves.toBeTruthy();
  });

  describe('name validation', () => {
    it('fails when name is empty', async () => {
      await expect(
        contactValidationSchema.validate({ ...validContact, name: '' })
      ).rejects.toThrow('El nombre es obligatorio');
    });

    it('fails when name contains only whitespace', async () => {
      await expect(
        contactValidationSchema.validate({ ...validContact, name: '   ' })
      ).rejects.toThrow();
    });

    it('fails when name is too short', async () => {
      await expect(
        contactValidationSchema.validate({ ...validContact, name: 'A' })
      ).rejects.toThrow('El nombre debe tener al menos 2 caracteres');
    });
  });

  describe('email validation', () => {
    it('fails when email is empty', async () => {
      await expect(
        contactValidationSchema.validate({ ...validContact, email: '' })
      ).rejects.toThrow('El correo electrónico es obligatorio');
    });

    it('fails when email format is invalid', async () => {
      await expect(
        contactValidationSchema.validate({
          ...validContact,
          email: 'not-an-email',
        })
      ).rejects.toThrow('Ingrese un correo electrónico válido');
    });
  });

  describe('department validation', () => {
    it('fails when department is missing or empty', async () => {
      await expect(
        contactValidationSchema.validate({ ...validContact, department: '' })
      ).rejects.toThrow();
    });

    it('fails when department is not in the allowed list', async () => {
      await expect(
        contactValidationSchema.validate({
          ...validContact,
          department: 'Recursos Humanos',
        })
      ).rejects.toThrow('Seleccione un departamento válido');
    });

    it.each(['Ventas', 'Desarrollo', 'Marketing', 'Soporte'])(
      'accepts allowed department: %s',
      async (department) => {
        await expect(
          contactValidationSchema.validate({ ...validContact, department })
        ).resolves.toBeTruthy();
      }
    );
  });
});
