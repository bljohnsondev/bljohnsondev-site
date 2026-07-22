import type { Handle, ServerInit } from '@sveltejs/kit';

import { initAtproto } from '$lib/server/atproto';

export const init: ServerInit = async () => {
  await initAtproto();
};

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return response;
};
