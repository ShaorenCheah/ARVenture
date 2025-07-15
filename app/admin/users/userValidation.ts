import * as yup from 'yup';

export interface CreateUserFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'merchant' | 'admin';
}

export const createUserValidationSchema = yup.object().shape({
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
  role: yup.string().oneOf(['user', 'merchant', 'admin']).required('Role is required'),
});
