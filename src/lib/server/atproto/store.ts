import type { Education, ExternalAccount, Position, Skill } from '$lib/schemas/sifa';
import type { SiteConfig } from '$lib/schemas/site-config';

import type { AtprotoProfile } from './profile';

export interface AtprotoData {
  profile: AtprotoProfile;
  siteConfig: SiteConfig;
  education: Education[];
  positions: Position[];
  skills: Skill[];
  externalAccounts: ExternalAccount[];
}

let atprotoData: AtprotoData | undefined;

export const setAtprotoData = (data: AtprotoData): void => {
  atprotoData = data;
};

export const getAtprotoData = (): AtprotoData => {
  if (!atprotoData) {
    throw new Error('Atproto data has not been initialized. Ensure the `init` server hook has run.');
  }

  return atprotoData;
};
