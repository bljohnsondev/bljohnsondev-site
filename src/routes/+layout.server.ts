import { loadNowRecord } from '$lib/server/atproto/now';
import { getAtprotoData } from '$lib/server/atproto/store';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const { profile, siteConfig, externalAccounts } = getAtprotoData();
  const now = await loadNowRecord();

  return { profile, site: siteConfig, externalAccounts, hasNow: now !== null };
};
