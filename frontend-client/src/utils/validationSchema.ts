import { object, string, ref } from 'yup';

export const validationSchema = object({
  username: string().required('Username is required').min(4, 'Username must be at least 4 characters'),
  email: string().email('Invalid email address').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Requires at least 1 uppercase letter')
    .matches(/[0-9]/, 'Requires at least 1 number')
    .matches(/[!@#$%^&*]/, 'Requires at least 1 special character')
    .required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
