import { env } from '$env/dynamic/private';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { type ContactFormData, contactSchema } from '$lib/schemas/contact-schema';
import { saveAndNotify, validateToken } from '$lib/server/services/contact-service';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const form = await superValidate<ContactFormData>(zod4(contactSchema));
  return { form };
};

export const actions: Actions = {
  default: async ({ request, getClientAddress }) => {
    const form = await superValidate(request, zod4(contactSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const ipAddress = getClientAddress();

    const { success } = await validateToken(form.data['cf-turnstile-response'], env.CF_TURNSTILE_SECRET_KEY, ipAddress);

    if (!success) {
      return setError(form, 'cf-turnstile-response', 'Invalid turnstile, please try again');
    }

    try {
      await saveAndNotify(form.data, ipAddress);
      return message(form, 'Your message has been sent');
    } catch (error) {
      console.error('Error sending contact message', error);
      return message(form, 'An error occurred sending your message', { status: 500 });
    }
  },
};
