import { BskyProfileSchema, ProfileSelfSchema, type ProfileSelf } from '$lib/schemas/sifa';

import { downloadBlobToPublic } from './assets';
import { getPlainRecord, type RepoContext } from './client';

export interface AtprotoProfile extends ProfileSelf {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}

export const loadProfile = async (repoContext: RepoContext): Promise<AtprotoProfile> => {
  const { agent, did, handle } = repoContext;

  console.info(`Fetching profile record for ${did}`);

  const [sifaRecord, bskyRecord] = await Promise.all([
    getPlainRecord(agent, { repo: did, collection: 'id.sifa.profile.self', rkey: 'self' }),
    getPlainRecord(agent, { repo: did, collection: 'app.bsky.actor.profile', rkey: 'self' }).catch(() => null),
  ]);

  const sifaProfile = ProfileSelfSchema.parse(sifaRecord.value);
  const bskyProfile = bskyRecord ? BskyProfileSchema.parse(bskyRecord.value) : null;
  const avatarBlob = bskyProfile?.avatar;

  let avatar: string | undefined;

  if (avatarBlob) {
    const downloadResult = await downloadBlobToPublic(agent, did, avatarBlob, {
      subdir: 'images',
      baseName: 'avatar',
    });

    if (!downloadResult.cached) {
      console.info(`Downloaded avatar for ${avatarBlob.ref.$link}`);
    }

    avatar = downloadResult.path;
  }

  return {
    ...sifaProfile,
    displayName: bskyProfile?.displayName,
    avatar,
    did,
    handle,
  };
};
