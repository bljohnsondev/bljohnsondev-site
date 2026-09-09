import { json, text, type RequestHandler } from '@sveltejs/kit';
import { timingSafeEqual } from 'node:crypto';

import { env } from '$env/dynamic/private';
import { statusIngestSchema } from '$lib/schemas/status-ingest';
import { ingestStatus } from '$lib/server/services/status-service';

function isAuthorized(request: Request): boolean {
  const expectedToken = env.STATUS_INGEST_TOKEN;
  if (!expectedToken) return false;

  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;

  const provided = Buffer.from(auth.slice(7));
  const expected = Buffer.from(expectedToken);

  // lengths must match before timingSafeEqual, and a wrong-length
  // token should still fail closed, not throw
  if (provided.length !== expected.length) return false;

  return timingSafeEqual(provided, expected);
}

export const POST: RequestHandler = async ({ request }) => {
  if (!isAuthorized(request)) {
    return text('Unauthorized', { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = statusIngestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
  }

  //console.log('[status-ingest] received payload:', JSON.stringify(parsed.data, null, 2));

  try {
    const saved = await ingestStatus(parsed.data);
    //console.log('[status-ingest] wrote status.json:', saved.updatedAt);
    return json({ ok: true, updatedAt: saved.updatedAt });
  } catch (error) {
    console.error('[status-ingest] failed to persist status record', error);
    return json({ error: 'Failed to persist status record' }, { status: 502 });
  }
};
