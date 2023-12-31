import { Collection, MongoClient } from "mongodb";
import BlobStorage from "./interface";
import { ObjectId } from "mongodb";
import { readFile } from "fs/promises";

const initialBlobStoragePaths: { [key: string]: string } = {
  ["65891f48da75b822c4d872f8"]: "./rsrc/localpics/post-1.png",
  ["65891f94da75b822c4d872f9"]: "./rsrc/localpics/post-2.png",
  ["65891fa1da75b822c4d872fa"]: "./rsrc/localpics/post-3.png",
  ["65891fa8da75b822c4d872fb"]: "./rsrc/localpics/post-1-submission-1.png",
  ["65891fafda75b822c4d872fc"]: "./rsrc/localpics/post-1-submission-2.png",
  ["65891fb6da75b822c4d872fd"]: "./rsrc/localpics/post-2-submission-1.png",
};

export default class LocalBlobStorage implements BlobStorage {
  coll: Collection;

  constructor() {
    this.coll = new MongoClient("mongodb://localhost:27017")
      .db("curio")
      .collection("blobs");
  }

  async ensureInit() {
    const promises = Object.entries(initialBlobStoragePaths).map(
      async ([key, path]) => {
        const data = await readFile(path);
        console.log("uploading blob: ", key);
        await this.coll.updateOne(
          { key },
          { $set: { key, data } },
          { upsert: true }
        );
      }
    );
    await Promise.all(promises);
  }

  async upload(blob: File): Promise<string> {
    await this.ensureInit();
    const key = new ObjectId().toString();
    const buffer = await blob.arrayBuffer().then((buf) => Buffer.from(buf));
    await this.coll.insertOne({ key, data: buffer });
    return Promise.resolve(key);
  }

  async get(key: string): Promise<Blob> {
    await this.ensureInit();
    const blobDoc = await this.coll.findOne({ key });
    if (!blobDoc) {
      return Promise.reject(`blob not found: '${key}'`);
    }
    return new Blob([blobDoc.data.buffer], { type: "image/png" });
  }
}
