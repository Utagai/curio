import BlobStorage from "./blob/interface";
import LocalBlobStorage from "./blob/local";
import VercelBlobStorage from "./blob/vercel";
import Database from "./db/interface";
import LocalDB from "./db/local";
import MongoDB from "./db/mongodb";

export function blobStorageFactory(): BlobStorage {
  switch (process.env.NODE_ENV) {
    case "development":
      return new LocalBlobStorage();
    case "production":
      return new VercelBlobStorage("prod");
    default:
      throw new Error("unknown environment");
  }
}

export function dbFactory(): Database {
  switch (process.env.NODE_ENV) {
    case "development":
      return new LocalDB();
    case "production":
      return new MongoDB(process.env.MONGODB_URI!);
    default:
      throw new Error("unknown environment");
  }
}
