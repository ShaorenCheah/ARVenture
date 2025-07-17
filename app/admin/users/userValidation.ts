import * as yup from 'yup';

export interface CreateUserFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'employee' | 'admin';
  delegatedSpot?: string;
}

export const createUserValidationSchema: yup.ObjectSchema<CreateUserFormInputs> = yup
  .object()
  .shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
    role: yup
      .string()
      .oneOf(['user', 'employee', 'admin'])
      .required('Role is required') as yup.StringSchema<'employee' | 'admin'>,
    delegatedSpot: yup.string().when('role', {
      is: 'employee',
      then: (schema) => schema.required('Delegated spot is required'),
      otherwise: (schema) => schema.optional(),
    }) as yup.StringSchema<string | undefined>,
  });
