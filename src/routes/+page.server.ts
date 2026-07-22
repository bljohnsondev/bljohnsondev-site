import { getAtprotoData } from '$lib/server/atproto/store';

import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
  const { education, positions, skills } = getAtprotoData();
  return { education, positions, skills };
};
