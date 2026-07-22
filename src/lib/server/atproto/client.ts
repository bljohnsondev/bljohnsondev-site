import { AtpAgent } from '@atproto/api';
import { IdResolver } from '@atproto/identity';
import { lexToJson } from '@atproto/lexicon';

const idResolver = new IdResolver();

export interface RepoContext {
  agent: AtpAgent;
  pdsUrl: string;
  did: string;
  handle: string;
}

export const getAgent = async (identifier: string): Promise<RepoContext> => {
  const did = identifier.startsWith('did:') ? identifier : await idResolver.handle.resolve(identifier);
  if (!did) {
    throw new Error(`could not resolve handle/DID: ${identifier}`);
  }

  const didDoc = await idResolver.did.resolve(did);
  if (!didDoc) {
    throw new Error(`could not resolve DID document for: ${did}`);
  }

  const pds = didDoc.service?.find(s => s.id === '#atproto_pds');
  if (!pds || typeof pds.serviceEndpoint !== 'string') {
    throw new Error(`no PDS service endpoint for: ${did}`);
  }

  const handle = didDoc.alsoKnownAs?.find(entry => entry.startsWith('at://'))?.replace('at://', '');
  if (!handle) {
    throw new Error(`no handle found in DID document for: ${did}`);
  }

  const pdsUrl = pds.serviceEndpoint;
  const agent = new AtpAgent({ service: pdsUrl });

  console.log(`Reading atproto data from pds: ${pdsUrl}`);

  return { agent, pdsUrl, did, handle };
};

export interface PlainRecord {
  uri: string;
  cid: string;
  value: unknown;
}

interface RecordLocator {
  repo: string;
  collection: string;
}

interface GetRecordParams extends RecordLocator {
  rkey: string;
}

export const getPlainRecord = async (agent: AtpAgent, params: GetRecordParams): Promise<PlainRecord> => {
  const res = await agent.com.atproto.repo.getRecord(params);
  return { uri: res.data.uri, cid: res.data.cid!, value: lexToJson(res.data.value) };
};

export const listPlainRecords = async (agent: AtpAgent, params: RecordLocator): Promise<PlainRecord[]> => {
  const records: PlainRecord[] = [];
  let cursor: string | undefined;

  do {
    const res = await agent.com.atproto.repo.listRecords({ ...params, cursor, limit: 100 });
    records.push(
      ...res.data.records.map(record => ({ uri: record.uri, cid: record.cid, value: lexToJson(record.value) }))
    );
    cursor = res.data.cursor;
  } while (cursor);

  return records;
};

export const getRkey = (uri: string): string => uri.split('/').at(-1)!;

export const getBlob = async (agent: AtpAgent, did: string, cid: string): Promise<Uint8Array> => {
  const res = await agent.com.atproto.sync.getBlob({ did, cid });
  return res.data;
};
