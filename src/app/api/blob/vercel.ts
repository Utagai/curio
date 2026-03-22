import { put, get } from "@vercel/blob";
import { ObjectId } from "mongodb";
import BlobStorage from "./interface";
import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env.local") });

export default class VercelBlobStorage implements BlobStorage {
  prefix: string;
  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async upload(blob: Blob): Promise<string> {
    const key = path.join(this.prefix, new ObjectId().toString());
    const putResult = await put(key, blob, {
      access: "private",
      token: process.env.BLOBS_READ_WRITE_TOKEN!,
    });
    return Promise.resolve(putResult.url);
  }

  async get(url: string): Promise<Blob> {
    const res = await get(url, {
      access: "private",
      token: process.env.BLOBS_READ_WRITE_TOKEN!,
    });

    if (res?.statusCode !== 200) {
      return Promise.reject(
        `Failed to fetch blob; status code: ${res?.statusCode}`,
      );
    }
    return Promise.resolve(
      streamToBlob(res.stream, res.headers.get("content-type") || undefined),
    );
  }
}

async function streamToBlob(
  stream: ReadableStream<Uint8Array>,
  mimeType?: string,
): Promise<Blob> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return new Blob(chunks, { type: mimeType });
}
