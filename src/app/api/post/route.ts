import { Difficulty } from "@/app/model/difficulty";
import { Post } from "@/app/model/post";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { blobStorageFactory, dbFactory } from "../factory";
import { InsertPost } from "../db/interface";

const [db, blobStorage] = [dbFactory(), blobStorageFactory()];

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

  // TODO: A clear problem here is that if the upload passes but the post insert fails, the blob will be orphaned.
  // I think instead of trying to invest into complicated things like 2PC we should just accept the
  // eventual consistency and have a cron job that cleans up orphaned blobs.
  // I'm not going to care about this right now but file a ticket for it instead.
  const blobKey = await blobStorage.upload(file);

  const insert: InsertPost = {
    blobKey: blobKey,
    title: extractStringValue(fdata, "title"),
    author: extractStringValue(fdata, "author"),
    submittedAt: extractDateValue(fdata, "time"),
    location: {
      lat: extractNumberValue(fdata, "lat"),
      lng: extractNumberValue(fdata, "lng"),
    },
    description: extractStringValue(fdata, "description"),
    difficulty: extractDifficultyValue(fdata, "difficulty"),
    submissions: [],
  };

  console.log(insert);

  const id = await db.insertPost(insert);

  return NextResponse.json({ ...insert, id }, { status: 200 });
}

function extractStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  } else {
    throw new Error(`Invalid value for key ${key}`);
  }
}

function extractDateValue(formData: FormData, key: string): Date {
  const dateString = extractStringValue(formData, key);
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value for key ${key}`);
  } else {
    return date;
  }
}

function extractNumberValue(formData: FormData, key: string): number {
  const value = formData.get(key);
  if (value) {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      return numberValue;
    }
  }
  throw new Error(`Invalid number value for key ${key}`);
}

function extractDifficultyValue(formData: FormData, key: string): Difficulty {
  return extractStringValue(formData, key) as Difficulty;
}
