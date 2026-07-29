import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        'Password must contain at least one letter and one number',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const eventSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be less than 500 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type EventFormData = z.infer<typeof eventSchema>;