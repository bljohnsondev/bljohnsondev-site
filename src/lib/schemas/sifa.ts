import { z } from 'zod';

import { ProfilePositionRecordSchema } from '@singi-labs/sifa-sdk/schemas';

export {
  BlobRefSchema,
  type BlobRef,
  ProfileEducationRecordSchema as EducationSchema,
  type ProfileEducationRecord as Education,
  ProfileExternalAccountRecordSchema as ExternalAccountSchema,
  type ProfileExternalAccountRecord as ExternalAccount,
  ProfileSelfRecordSchema as ProfileSelfSchema,
  type ProfileSelfRecord as ProfileSelf,
  ProfileSkillRecordSchema as SkillSchema,
  type ProfileSkillRecord as Skill,
} from '@singi-labs/sifa-sdk/schemas';

// The sifa-sdk generated schema requires `skills[].cid`, but the lexicon lists it as optional
// so my live profile records only specify uri
export const PositionSchema = ProfilePositionRecordSchema.extend({
  skills: z
    .array(z.object({ uri: z.string(), cid: z.string().optional() }))
    .max(50)
    .optional(),
});

export type Position = z.infer<typeof PositionSchema>;

const BskyBlobRefSchema = z.object({
  $type: z.literal('blob'),
  ref: z.object({ $link: z.string() }),
  mimeType: z.string(),
  size: z.number(),
});

export const BskyProfileSchema = z.object({
  displayName: z.string().optional(),
  avatar: BskyBlobRefSchema.optional(),
});

export type BskyProfile = z.infer<typeof BskyProfileSchema>;
