import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .max(64, 'Name must be 64 characters or less')
    // this check will validate only if the user enters a value in the field
    .refine(value => value === '' || value.length >= 2, 'Name should be at least 2 characters')
    .default(''),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email('Must be a valid email'))
    .pipe(z.string().max(254, 'Email must be 64 characters or less')),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message must be 1,000 characters or less'),
  'cf-turnstile-response': z.string().min(1, 'Please complete the captcha'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
