import type { AtpAgent } from '@atproto/api';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { BlobRef } from '$lib/schemas/sifa';

import { getBlob } from './client';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const fileExists = async (filePath: string): Promise<boolean> => {
  return access(filePath)
    .then(() => true)
    .catch(() => false);
};

export interface DownloadBlobResult {
  path: string;
  cached: boolean;
}

export const downloadBlobToPublic = async (
  agent: AtpAgent,
  did: string,
  blob: BlobRef,
  options: { subdir: string; baseName: string }
): Promise<DownloadBlobResult> => {
  const cid = blob.ref.$link;
  const filename = `${options.baseName}-${cid}.${MIME_EXTENSIONS[blob.mimeType] ?? 'bin'}`;
  const outDir = path.join(process.cwd(), 'static', options.subdir);
  const outPath = path.join(outDir, filename);
  const publicPath = `/${options.subdir}/${filename}`;

  if (await fileExists(outPath)) {
    return { path: publicPath, cached: true };
  }

  await mkdir(outDir, { recursive: true });
  const bytes = await getBlob(agent, did, cid);
  await writeFile(outPath, bytes);

  return { path: publicPath, cached: false };
};
