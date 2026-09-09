import { getAtprotoData } from '$lib/server/atproto/store';
import { isStatusEnabled } from '$lib/server/status-store';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const { profile, siteConfig, externalAccounts } = getAtprotoData();
  return { profile, site: siteConfig, externalAccounts, nowEnabled: isStatusEnabled() };
};
