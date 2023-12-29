import { put } from "@vercel/blob";
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
    const putResult = await put(key, blob, { access: "public" });
    return Promise.resolve(putResult.url);
  }

  async get(url: string): Promise<Blob> {
    const res = await fetch(url);
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.blob();
  }
}
