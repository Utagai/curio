import BlobStorage from "./interface";
import { ObjectId } from "mongodb";
import * as fs from "fs/promises";
import * as path from "path";

const BLOB_DIR = path.join(process.cwd(), "rsrc", "localpics");

type Image = {
  path: string;
  kind: string;
};

export default class FileBlobStorage implements BlobStorage {
  private initialized: Promise<void>;
  private blobs: Map<string, Image>;

  constructor() {
    this.blobs = new Map();
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    await fs.mkdir(BLOB_DIR, { recursive: true });
    const files = await fs.readdir(BLOB_DIR);
    for (const file of files) {
      const fileExt = file.split(".").pop()!;
      if (fileExt == "png" || fileExt == "jpeg" || fileExt == "jpg") {
        const key = file.replace(`.${fileExt}`, "");
        this.blobs.set(key, {
          path: path.join(BLOB_DIR, file),
          kind: `image/${fileExt}`,
        });
      }
    }
  }

  async ensureInit() {
    await this.initialized;
  }

  async upload(blob: File): Promise<string> {
    await this.ensureInit();
    const key = new ObjectId().toString();
    const filePath = path.join(BLOB_DIR, `${key}.png`); // Assuming all blobs are PNGs
    const buffer = await blob.arrayBuffer().then((buf) => Buffer.from(buf));
    await fs.writeFile(filePath, buffer);
    this.blobs.set(key, { path: filePath, kind: blob.type });
    return Promise.resolve(key);
  }

  async get(key: string): Promise<Blob> {
    await this.ensureInit();
    const blob = this.blobs.get(key);
    if (!blob) {
      return Promise.reject(`blob not found: '${key}'`);
    }
    try {
      const data = await fs.readFile(blob.path);
      return new Blob([data.buffer], { type: `image/${blob.kind}` });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return Promise.reject(`blob not found: '${key}'`);
      }
      throw error;
    }
  }
}
