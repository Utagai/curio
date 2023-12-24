import MemoryBlobStorage from "@/app/db/blob/memory";
import { NextRequest, NextResponse } from "next/server";

const blobStorage = (() => {
  const memoryBlobStorage = new MemoryBlobStorage();
  return memoryBlobStorage;
})();

export async function PUT(req: NextRequest) {
  const fdata = await req.formData();

  const file = fdata.get("image");

  console.log(`File received: ${file}`);

  if (file && file instanceof File) {
    console.log(`File name: ${file.name}`);
  } else {
    return NextResponse.json(
      { error: "invalid or no file provided" },
      { status: 400 }
    );
  }

  const postMetadata = {
    title: fdata.get("title"),
    author: fdata.get("author"),
    time: fdata.get("time"),
    loc: { lat: fdata.get("lat"), lng: fdata.get("lng") },
    description: fdata.get("description"),
    difficulty: fdata.get("difficulty"),
  };

  console.log(postMetadata);

  return NextResponse.json(postMetadata, { status: 200 });
}
