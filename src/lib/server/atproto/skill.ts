import { SkillSchema, type Skill } from '$lib/schemas/sifa';

import { listPlainRecords, type RepoContext } from './client';

export const loadSkills = async (repoContext: RepoContext): Promise<Skill[]> => {
  const { agent, did } = repoContext;

  console.info(`Fetching skill records for ${did}`);

  const records = await listPlainRecords(agent, { repo: did, collection: 'id.sifa.profile.skill' });

  return records.map(record => SkillSchema.parse(record.value));
};
