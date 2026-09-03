import { env } from '$env/dynamic/private';
import ky from 'ky';

import { getDb } from '$lib/server/db';
import { contactMessages } from '$lib/server/db/schema';
import type { ContactFormData } from '$lib/schemas/contact';

export const saveAndNotify = async (data: ContactFormData, ipAddress: string | null) => {
  await getDb()
    .insert(contactMessages)
    .values({
      name: data.name || null,
      email: data.email || null,
      message: data.message,
      ipAddress,
      createdAt: new Date(),
    });

  await sendAppriseNotification(data);
};

const sendAppriseNotification = async (data: ContactFormData) => {
  if (!env.APPRISE_URL) return;

  const body = [
    data.name ? `From: ${data.name}` : null,
    data.email ? `Email: ${data.email}` : null,
    `Message: ${data.message}`,
  ]
    .filter(Boolean)
    .join('\n');

  await ky.post(env.APPRISE_URL, {
    json: {
      title: 'Contact message from website',
      body,
    },
  });
};

export interface TokenValidateResponse {
  'error-codes': string[];
  success: boolean;
  action: string;
  cdata: string;
}

export const validateToken = async (token: string, secret: string, remoteIp: string) => {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        response: token,
        secret: secret,
        remoteip: remoteIp,
      }),
    });

    const data: TokenValidateResponse = await response.json();

    return {
      success: data.success,
      error: data['error-codes']?.length ? data['error-codes'][0] : null,
    };
  } catch {
    return { success: false, error: 'internal-error' };
  }
};
