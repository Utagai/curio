import { NextRequest } from "next/server";
import { blobStorageFactory, dbFactory } from "../../factory";

const [_, blobStorage] = [dbFactory(), blobStorageFactory()];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blobKey = searchParams.get("blobKey")!;
  const blob = await blobStorage.get(blobKey);
  const resp = new Response(blob);
  resp.headers.set("Content-Type", "image/png");
  return resp;
}
