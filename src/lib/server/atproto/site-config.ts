import { SiteConfigSchema, type SiteConfig } from '$lib/schemas/site-config';

import { getPlainRecord, type RepoContext } from './client';

export const loadSiteConfig = async (repoContext: RepoContext): Promise<SiteConfig> => {
  const { agent, did } = repoContext;

  console.info(`Fetching site config record for ${did}`);

  const record = await getPlainRecord(agent, { repo: did, collection: 'dev.bljohnson.site.config', rkey: 'self' });

  return SiteConfigSchema.parse(record.value);
};
