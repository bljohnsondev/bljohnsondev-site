import { AtpAgent } from '@atproto/api';

import { env } from '$env/dynamic/private';

import { getAgent } from './client';

export interface AuthedRepo {
  agent: AtpAgent;
  did: string;
}

let authedRepoPromise: Promise<AuthedRepo> | undefined;

const createAuthedRepo = async (): Promise<AuthedRepo> => {
  const handle = env.ATPROTO_HANDLE;
  const appPassword = env.ATPROTO_APP_PASSWORD;

  if (!handle || !appPassword) {
    throw new Error('ATPROTO_HANDLE and ATPROTO_APP_PASSWORD must both be set to write atproto records');
  }

  const { pdsUrl } = await getAgent(handle);
  const agent = new AtpAgent({ service: pdsUrl });
  const { data } = await agent.login({ identifier: handle, password: appPassword });

  console.log(`Authenticated atproto agent for ${handle} on ${pdsUrl}`);

  return { agent, did: data.did };
};

export const getAuthedRepo = (): Promise<AuthedRepo> => {
  authedRepoPromise ??= createAuthedRepo().catch((error: unknown) => {
    authedRepoPromise = undefined;
    throw error;
  });
  return authedRepoPromise;
};

export const resetAuthedRepo = (): void => {
  authedRepoPromise = undefined;
};
