import { XRPCError } from '@atproto/api';

import { env } from '$env/dynamic/private';

import { nowRecordSchema, toNowRecord, type NowRecord, type StatusIngest } from '$lib/schemas/status-ingest';

import { getPlainRecord } from './client';
import { getRepoContext } from './repo';
import { getAuthedRepo, resetAuthedRepo } from './write-client';

const NOW_COLLECTION = 'dev.bljohnson.site.now';
const NOW_RKEY = 'self';

const DEFAULT_NOW_CACHE_TTL_SECONDS = 60;

export const getNowCacheTtlSeconds = (): number => {
  const parsed = Number(env.NOW_CACHE_TTL_SECONDS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_NOW_CACHE_TTL_SECONDS;
};

export interface SavedRecord {
  uri: string;
  cid: string;
}

export const saveNowRecord = async (data: StatusIngest): Promise<SavedRecord> => {
  const record = { $type: NOW_COLLECTION, ...toNowRecord(data) };

  try {
    try {
      return await putNowRecord(record);
    } catch (error) {
      if (!isAuthError(error)) throw error;
      console.warn(
        'putRecord for dev.bljohnson.site.now failed with an auth error; re-authenticating and retrying',
        error
      );
      resetAuthedRepo();
      return await putNowRecord(record);
    }
  } finally {
    // A fresh write just landed — don't keep serving the stale read.
    clearNowRecordCache();
  }
};

const isAuthError = (error: unknown): boolean => {
  if (!(error instanceof XRPCError)) return false;
  return error.status === 401 || error.error === 'ExpiredToken' || error.error === 'InvalidToken';
};

const putNowRecord = async (record: Record<string, unknown>): Promise<SavedRecord> => {
  const { agent, did } = await getAuthedRepo();

  const res = await agent.com.atproto.repo.putRecord({
    repo: did,
    collection: NOW_COLLECTION,
    rkey: NOW_RKEY,
    record,
    validate: false,
  });

  return { uri: res.data.uri, cid: res.data.cid };
};

// ---- Read side (the /now page) ----

interface NowCacheEntry {
  record: NowRecord | null;
  fetchedAt: number;
}

let nowCache: NowCacheEntry | undefined;

// Drop the cached `now` record so the next read hits the PDS
export const clearNowRecordCache = (): void => {
  nowCache = undefined;
};

export const loadNowRecord = async (): Promise<NowRecord | null> => {
  if (nowCache && Date.now() - nowCache.fetchedAt < getNowCacheTtlSeconds() * 1000) {
    return nowCache.record;
  }

  const record = await fetchNowRecord();
  nowCache = { record, fetchedAt: Date.now() };
  return record;
};

const fetchNowRecord = async (): Promise<NowRecord | null> => {
  const { agent, did } = await getRepoContext();

  let value: unknown;
  try {
    ({ value } = await getPlainRecord(agent, { repo: did, collection: NOW_COLLECTION, rkey: NOW_RKEY }));
  } catch (error) {
    if (isRecordNotFound(error)) return null;
    throw error;
  }

  return nowRecordSchema.parse(value);
};

const isRecordNotFound = (error: unknown): boolean => {
  const xrpcError = error as { error?: string; message?: string };
  return xrpcError?.error === 'RecordNotFound' || /could not locate record/i.test(xrpcError?.message ?? '');
};
