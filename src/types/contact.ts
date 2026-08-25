import { DEPARTMENTS, ALL_DEPARTMENTS } from '../constants/departments';

export type Department = (typeof DEPARTMENTS)[number];

export type DepartmentFilter = Department | typeof ALL_DEPARTMENTS;

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: Department;
};

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  department: Department | '';
};
