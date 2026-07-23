import { z } from 'zod';

import { ProfilePositionRecordSchema, ProfileSkillRecordSchema } from '@singi-labs/sifa-sdk/schemas';

export {
  BlobRefSchema,
  type BlobRef,
  ProfileEducationRecordSchema as EducationSchema,
  type ProfileEducationRecord as Education,
  ProfileExternalAccountRecordSchema as ExternalAccountSchema,
  type ProfileExternalAccountRecord as ExternalAccount,
  ProfileSelfRecordSchema as ProfileSelfSchema,
  type ProfileSelfRecord as ProfileSelf,
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

// added a subCategory that is not in the official lexicon so I can group the skills in a way
// that works better for me
export const SkillSchema = ProfileSkillRecordSchema.extend({
  subCategory: z.string().max(200).optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

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
