import { toNowRecord, type NowRecord, type StatusIngest } from '$lib/schemas/status-ingest';
import { getStatus, setStatus } from '$lib/server/status-store';

export const ingestStatus = async (payload: StatusIngest): Promise<NowRecord> => {
  const existing = getStatus();
  const next = toNowRecord(payload);

  if (payload.nowWatching === undefined && existing?.nowWatching) {
    next.nowWatching = existing.nowWatching;
  }

  await setStatus(next);
  return next;
};
