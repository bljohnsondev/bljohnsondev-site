import { env } from '$env/dynamic/private';

import { getAgent, type RepoContext } from './client';

export const loadRepoContext = (): Promise<RepoContext> => getAgent(env.ATPROTO_HANDLE);

let repoContextPromise: Promise<RepoContext> | undefined;

export const getRepoContext = (): Promise<RepoContext> => {
  repoContextPromise ??= loadRepoContext().catch((error: unknown) => {
    repoContextPromise = undefined;
    throw error;
  });
  return repoContextPromise;
};
