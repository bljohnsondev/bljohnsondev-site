import { env } from '$env/dynamic/private';

import { getAgent, type RepoContext } from './client';

export const loadRepoContext = (): Promise<RepoContext> => getAgent(env.ATPROTO_HANDLE);
