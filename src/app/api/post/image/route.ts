import LocalBlobStorage from "@/app/api/blob/local";
import LocalDB from "@/app/api/db/local";
import { NextRequest } from "next/server";

const blobStorage = (() => {
  const memoryBlobStorage = new LocalBlobStorage();
  return memoryBlobStorage;
})();

const db = (() => {
  const memoryDb = new LocalDB();
  return memoryDb;
})();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  const post = await db.postById(id);
  const blob = await blobStorage.get(post.blobKey);
  const resp = new Response(blob);
  resp.headers.set("Content-Type", "image/png");
  return resp;
}
