import { EducationSchema, type Education } from '$lib/schemas/sifa';

import { listPlainRecords, type RepoContext } from './client';

export const loadEducation = async (repoContext: RepoContext): Promise<Education[]> => {
  const { agent, did } = repoContext;

  console.info(`Fetching education records for ${did}`);

  const records = await listPlainRecords(agent, { repo: did, collection: 'id.sifa.profile.education' });

  return records.map(record => EducationSchema.parse(record.value));
};
