import { error } from '@sveltejs/kit';

import { getStatus, isStatusEnabled } from '$lib/server/status-store';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  if (!isStatusEnabled()) {
    error(404, 'Not found');
  }

  // no browser caching so the page shows the latest update
  setHeaders({ 'cache-control': 'no-store' });

  return { now: getStatus() };
};
