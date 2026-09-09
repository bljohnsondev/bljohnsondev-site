import { error } from '@sveltejs/kit';

import { getNowCacheTtlSeconds, getStatus, isStatusEnabled } from '$lib/server/status-store';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  if (!isStatusEnabled()) {
    error(404, 'Not found');
  }

  const maxAge = getNowCacheTtlSeconds();
  setHeaders({ 'cache-control': `public, max-age=${maxAge}, stale-while-revalidate=${maxAge}` });

  return { now: getStatus() };
};
