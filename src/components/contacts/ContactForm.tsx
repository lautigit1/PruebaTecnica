import React from 'react';
import { useFormik } from 'formik';
import { contactValidationSchema } from '../../schemas/contactSchema';
import { DEPARTMENTS } from '../../constants/departments';
import { Contact, ContactFormValues, Department } from '../../types/contact';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export interface ContactFormProps {
  onSubmit: (values: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  department: '',
};

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel }) => {
  const formik = useFormik<ContactFormValues>({
    initialValues,
    validationSchema: contactValidationSchema,
    validateOnMount: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        department: values.department as Department,
      });
      resetForm();
    },
  });

  const departmentOptions = DEPARTMENTS.map((dept) => ({ value: dept, label: dept }));
  const isSubmitDisabled = !formik.isValid || !formik.dirty || formik.isSubmitting;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex min-h-0 flex-col">
      <div className="flex flex-col gap-4 overflow-y-auto p-5">
        <Input
          label="Nombre completo"
          name="name"
          placeholder="Ej: Juan Pérez"
          autoComplete="off"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
          required
          autoFocus
        />

        <Input
          type="email"
          label="Correo electrónico"
          name="email"
          placeholder="Ej: juan.perez@empresa.com"
          autoComplete="off"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email ? formik.errors.email : undefined}
          required
        />

        <Input
          type="tel"
          label="Teléfono"
          optionalLabel="opcional"
          name="phone"
          placeholder="Ej: +54 11 4521-8890"
          autoComplete="off"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone ? formik.errors.phone : undefined}
        />

        <Select
          label="Departamento"
          name="department"
          placeholder="Seleccionar departamento"
          options={departmentOptions}
          value={formik.values.department}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.department ? formik.errors.department : undefined}
          required
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-2 border-t border-line-soft bg-[#FCFBF9] px-5 py-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto sm:min-w-[110px]"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
          isLoading={formik.isSubmitting}
          className="w-full sm:w-auto sm:min-w-[140px]"
        >
          Guardar contacto
        </Button>
      </div>
    </form>
  );
};
