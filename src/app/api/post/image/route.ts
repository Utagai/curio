import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { blobStorageFactory, dbFactory } from "../../factory";

const [_, blobStorage] = [dbFactory(), blobStorageFactory()];

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const blobKey = searchParams.get("blobKey")!;
  const blob = await blobStorage.get(blobKey);
  const resp = new Response(blob);
  resp.headers.set("Content-Type", "image/png");
  return resp;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    throw new Error("invalid or no file provided");
  }
  const blobKey = await blobStorage.upload(file);

  return new Response(blobKey);
}
