import { readFileSync } from 'node:fs';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { env } from '$env/dynamic/private';

import { nowRecordSchema, type NowRecord } from '$lib/schemas/status-ingest';

const DEFAULT_NOW_CACHE_TTL_SECONDS = 60;

let cachedStatus: NowRecord | null = null;

export const getNowCacheTtlSeconds = (): number => {
  const parsed = Number(env.NOW_CACHE_TTL_SECONDS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_NOW_CACHE_TTL_SECONDS;
};

const getStatusFilePath = (): string => {
  const filePath = env.STATUS_FILE_PATH;

  if (!filePath) {
    throw new Error('STATUS_FILE_PATH must be set to persist the /now status record');
  }

  return filePath;
};

export const isStatusEnabled = (): boolean => Boolean(env.STATUS_FILE_PATH);

const isNotFoundError = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === 'ENOENT';

export const loadStatus = (): void => {
  const filePath = getStatusFilePath();

  let fileContents: string;
  try {
    fileContents = readFileSync(filePath, 'utf-8');
  } catch (error) {
    if (isNotFoundError(error)) {
      cachedStatus = null;
      return;
    }
    throw error;
  }

  cachedStatus = nowRecordSchema.parse(JSON.parse(fileContents));
};

export const getStatus = (): NowRecord | null => cachedStatus;

export const setStatus = async (next: NowRecord): Promise<void> => {
  const filePath = getStatusFilePath();
  const tmpPath = `${filePath}.tmp`;

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(tmpPath, JSON.stringify(next, null, 2), 'utf-8');
  await rename(tmpPath, filePath);

  cachedStatus = next;
};
