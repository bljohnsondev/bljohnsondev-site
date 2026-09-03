import { error } from '@sveltejs/kit';

import { getNowCacheTtlSeconds, loadNowRecord } from '$lib/server/atproto/now';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const now = await loadNowRecord();

  if (!now) {
    // No dev.bljohnson.site.now record has been written yet — the page has nothing to show.
    error(404, 'Not found');
  }

  // Browser/proxy freshness window; the server also holds its own in-memory cache.
  const maxAge = getNowCacheTtlSeconds();
  setHeaders({ 'cache-control': `public, max-age=${maxAge}, stale-while-revalidate=${maxAge}` });

  return { now };
};
