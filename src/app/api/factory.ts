import BlobStorage from "./blob/interface";
import VercelBlobStorage from "./blob/vercel";
import Database from "./db/interface";
import FileDB from "./db/file";
import MongoDB from "./db/mongodb";
import FileBlobStorage from "./blob/local";

export function blobStorageFactory(): BlobStorage {
  switch (process.env.NODE_ENV) {
    case "development":
      return new FileBlobStorage();
    case "production":
      return new VercelBlobStorage("prod");
    default:
      throw new Error("unknown environment");
  }
}

export function dbFactory(): Database {
  switch (process.env.NODE_ENV) {
    case "development":
      return new FileDB();
    case "production":
      return new MongoDB();
    default:
      throw new Error("unknown environment");
  }
}
