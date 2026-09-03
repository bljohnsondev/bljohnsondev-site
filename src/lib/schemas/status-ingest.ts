import { z } from 'zod';

// ---- Ingest payload (what Node-RED / Home Assistant POSTs) ----
// Numbers arrive as natural floats here; the conversion to an atproto-safe
// record shape happens in `toNowRecord` below.

const sensorReading = z.object({
  label: z.string(),
  tempF: z.number(),
  humidity: z.number().min(0).max(100).optional(),
  updatedAt: z.iso.datetime(),
});

const officeSchema = z.object({
  lightsOn: z.boolean(),
  updatedAt: z.iso.datetime(),
});

const nowWatchingSchema = z.object({
  show: z.string(),
  season: z.number().int().positive(),
  episode: z.number().int().positive(),
  episodeTitle: z.string().optional(),
  watchedAt: z.iso.datetime(),
});

export const statusIngestSchema = z.object({
  updatedAt: z.iso.datetime(),
  sensors: z.record(z.string(), sensorReading).optional(),
  office: officeSchema.optional(),
  nowWatching: nowWatchingSchema.optional(),
});

export type StatusIngest = z.infer<typeof statusIngestSchema>;

// ---- Stored record shape (dev.bljohnson.site.now) ----
// The atproto data model forbids floating-point numbers, so fractional readings
// are stored as strings (the spec's recommended fallback) and whole-number
// readings as integers.

const nowSensorReading = z.object({
  label: z.string(),
  tempF: z.string(), // e.g. "84.6"
  humidity: z.number().int().min(0).max(100).optional(),
  updatedAt: z.iso.datetime(),
});

type NowSensorReading = z.infer<typeof nowSensorReading>;

export const nowRecordSchema = z.object({
  updatedAt: z.iso.datetime(),
  sensors: z.record(z.string(), nowSensorReading).optional(),
  office: officeSchema.optional(),
  nowWatching: nowWatchingSchema.optional(),
});

export type NowRecord = z.infer<typeof nowRecordSchema>;

/** Maps a validated ingest payload to the atproto-safe `dev.bljohnson.site.now` record shape. */
export function toNowRecord(payload: StatusIngest): NowRecord {
  const record: NowRecord = { updatedAt: payload.updatedAt };

  if (payload.office) record.office = payload.office;
  if (payload.nowWatching) record.nowWatching = payload.nowWatching;

  if (payload.sensors) {
    record.sensors = Object.fromEntries(
      Object.entries(payload.sensors).map(([sensorId, reading]) => {
        const stored: NowSensorReading = {
          label: reading.label,
          tempF: reading.tempF.toFixed(1),
          updatedAt: reading.updatedAt,
        };
        if (reading.humidity !== undefined) {
          stored.humidity = Math.round(reading.humidity);
        }
        return [sensorId, stored];
      })
    );
  }

  return record;
}
