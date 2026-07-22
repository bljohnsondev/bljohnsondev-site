import { ExternalAccountSchema, type ExternalAccount } from '$lib/schemas/sifa';

import { listPlainRecords, type RepoContext } from './client';

export const loadExternalAccounts = async (repoContext: RepoContext): Promise<ExternalAccount[]> => {
  const { agent, did } = repoContext;

  console.info(`Fetching external account records for ${did}`);

  const records = await listPlainRecords(agent, { repo: did, collection: 'id.sifa.profile.externalAccount' });

  return records.map(record => ExternalAccountSchema.parse(record.value));
};
