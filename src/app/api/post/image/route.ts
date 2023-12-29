import { NextRequest } from "next/server";
import { blobStorageFactory, dbFactory } from "../../factory";

const [db, blobStorage] = [dbFactory(), blobStorageFactory()];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  const post = await db.postById(id);
  const blob = await blobStorage.get(post.blobKey);
  const resp = new Response(blob);
  resp.headers.set("Content-Type", "image/png");
  return resp;
}
