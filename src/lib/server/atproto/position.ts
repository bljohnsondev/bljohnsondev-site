import { PositionSchema, type Position } from '$lib/schemas/sifa';

import { listPlainRecords, type RepoContext } from './client';

export const loadPositions = async (repoContext: RepoContext): Promise<Position[]> => {
  const { agent, did } = repoContext;

  console.info(`Fetching position records for ${did}`);

  const records = await listPlainRecords(agent, { repo: did, collection: 'id.sifa.profile.position' });

  return records
    .map(record => PositionSchema.parse(record.value))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
};
