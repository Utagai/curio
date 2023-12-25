import LocalBlobStorage from "@/app/blob/local";
import LocalDB from "@/app/db/local";
import { Difficulty } from "@/app/model/difficulty";
import { Post } from "@/app/model/post";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const blobStorage = (() => {
  const memoryBlobStorage = new LocalBlobStorage();
  return memoryBlobStorage;
})();

const db = (() => {
  const memoryDb = new LocalDB();
  return memoryDb;
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

  const blobKey = await blobStorage.upload(file);

  const post: Post = {
    id: uuid(),
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

  console.log(post);

  const postId = await db.insertPost(post);

  return NextResponse.json({ post, postId }, { status: 200 });
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
