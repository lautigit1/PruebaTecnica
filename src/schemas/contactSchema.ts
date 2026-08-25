import * as Yup from 'yup';
import { DEPARTMENTS } from '../constants/departments';

// Phone regex allowing typical international / local formats (e.g., +54 11 1234-5678, 12345678)
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const contactValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede superar los 80 caracteres'),

  email: Yup.string()
    .trim()
    .required('El correo electrónico es obligatorio')
    .email('Ingrese un correo electrónico válido')
    .max(100, 'El correo electrónico no puede superar los 100 caracteres'),

  phone: Yup.string()
    .trim()
    .test('phone-format', 'Ingrese un número de teléfono válido', (value) => {
      if (!value || value.trim() === '') return true; // Optional field
      return PHONE_REGEX.test(value.trim()) && value.trim().length >= 6;
    })
    .max(30, 'El teléfono no puede superar los 30 caracteres')
    .optional(),

  department: Yup.string()
    .oneOf(DEPARTMENTS, 'Seleccione un departamento válido')
    .required('El departamento es obligatorio'),
});
