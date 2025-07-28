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

  constructor() {
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    await fs.mkdir(BLOB_DIR, { recursive: true });
  }

  async ensureInit() {
    await this.initialized;
  }

  async upload(blob: File): Promise<string> {
    await this.ensureInit();
    const key = new ObjectId().toString();

    // Determine file extension based on MIME type
    let extension = ".png"; // default
    if (blob.type === "image/jpeg" || blob.type === "image/jpg") {
      extension = ".jpg";
    } else if (blob.type === "image/png") {
      extension = ".png";
    }

    const filePath = path.join(BLOB_DIR, `${key}${extension}`);
    const buffer = await blob.arrayBuffer().then((buf) => Buffer.from(buf));
    await fs.writeFile(filePath, buffer);
    return Promise.resolve(key);
  }

  async get(key: string): Promise<Blob> {
    await this.ensureInit();

    // Try different file extensions
    const extensions = [".png", ".jpg"];

    for (const ext of extensions) {
      const filePath = path.join(BLOB_DIR, `${key}${ext}`);
      try {
        const data = await fs.readFile(filePath);
        const mimeType = ext === ".jpg" ? "image/jpeg" : "image/png";
        return new Blob([data.buffer], { type: mimeType });
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          throw error;
        }
        // Continue to next extension if file not found
      }
    }

    return Promise.reject(`blob not found: '${key}'`);
  }
}
