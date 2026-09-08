import { z } from 'zod';

// ---- Ingest payload (what Node-RED / Home Assistant POSTs) ----
// Numbers arrive as natural floats here; the conversion to an atproto-safe
// record shape happens in `toNowRecord` below.

const tempEntity = z.object({
  type: z.literal('temp'),
  label: z.string(),
  tempF: z.number(),
  humidity: z.number().min(0).max(100).optional(),
  updatedAt: z.iso.datetime(),
});

const toggleEntity = z.object({
  type: z.literal('toggle'),
  label: z.string(),
  on: z.boolean(),
  updatedAt: z.iso.datetime(),
});

const haEntity = z.discriminatedUnion('type', [tempEntity, toggleEntity]);

const nowWatchingSchema = z.object({
  show: z.string(),
  season: z.number().int().positive(),
  episode: z.number().int().positive(),
  episodeTitle: z.string().optional(),
  imageUrl: z.url().optional(),
  watchedAt: z.iso.datetime(),
});

export const statusIngestSchema = z.object({
  updatedAt: z.iso.datetime(),
  entities: z.record(z.string(), haEntity).optional(),
  nowWatching: nowWatchingSchema.optional(),
});

export type StatusIngest = z.infer<typeof statusIngestSchema>;

// ---- Stored record shape (dev.bljohnson.site.now) ----
// The atproto data model forbids floating-point numbers, so fractional temp
// readings are stored as strings (the spec's recommended fallback); humidity
// is stored as an integer.

const nowTempEntity = z.object({
  type: z.literal('temp'),
  label: z.string(),
  tempF: z.string(), // e.g. "84.6"
  humidity: z.number().int().min(0).max(100).optional(),
  updatedAt: z.iso.datetime(),
});

const nowToggleEntity = z.object({
  type: z.literal('toggle'),
  label: z.string(),
  on: z.boolean(),
  updatedAt: z.iso.datetime(),
});

const nowHaEntity = z.discriminatedUnion('type', [nowTempEntity, nowToggleEntity]);

type NowHaEntity = z.infer<typeof nowHaEntity>;

export const nowRecordSchema = z.object({
  updatedAt: z.iso.datetime(),
  entities: z.record(z.string(), nowHaEntity).optional(),
  nowWatching: nowWatchingSchema.optional(),
});

export type NowRecord = z.infer<typeof nowRecordSchema>;

/** Maps a validated ingest payload to the atproto-safe `dev.bljohnson.site.now` record shape. */
export function toNowRecord(payload: StatusIngest): NowRecord {
  const record: NowRecord = { updatedAt: payload.updatedAt };

  if (payload.nowWatching) record.nowWatching = payload.nowWatching;

  if (payload.entities) {
    record.entities = Object.fromEntries(
      Object.entries(payload.entities).map(([entityId, entity]) => {
        const stored: NowHaEntity =
          entity.type === 'temp'
            ? {
                type: 'temp',
                label: entity.label,
                tempF: entity.tempF.toFixed(1),
                ...(entity.humidity !== undefined ? { humidity: Math.round(entity.humidity) } : {}),
                updatedAt: entity.updatedAt,
              }
            : { type: 'toggle', label: entity.label, on: entity.on, updatedAt: entity.updatedAt };
        return [entityId, stored];
      })
    );
  }

  return record;
}
