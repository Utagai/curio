"use server";

import { Difficulty } from "@/app/model/difficulty";
import { Post } from "@/app/model/post";
import { v4 as uuid } from "uuid";
import { blobStorageFactory, dbFactory } from "./api/factory";
import { InsertPost } from "./api/db/interface";

const [db, blobStorage] = [dbFactory(), blobStorageFactory()];

export async function createPost(formData: FormData) {
  const file = formData.get("image");

  if (!(file instanceof File)) {
    throw new Error("invalid or no file provided");
  }

  const blobKey = await blobStorage.upload(file);

  const insert: InsertPost = {
    blobKey: blobKey,
    title: extractStringValue(formData, "title"),
    author: extractStringValue(formData, "author"),
    submittedAt: extractDateValue(formData, "time"),
    location: {
      lat: extractNumberValue(formData, "lat"),
      lng: extractNumberValue(formData, "lng"),
    },
    description: extractStringValue(formData, "description"),
    difficulty: extractDifficultyValue(formData, "difficulty"),
    submissions: [],
  };

  const id = await db.insertPost(insert);

  return { ...insert, id };
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
