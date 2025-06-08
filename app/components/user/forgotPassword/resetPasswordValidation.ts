import * as yup from 'yup';

export interface ResetPasswordInputs {
  email: string;
}

const resetPasswordSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
});

export default resetPasswordSchema;
