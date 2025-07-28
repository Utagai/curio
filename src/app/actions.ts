"use server";

import { Difficulty } from "@/app/model/difficulty";
import { Post } from "@/app/model/post";
import { Submission } from "@/app/model/submission";
import { blobStorageFactory, dbFactory } from "./api/factory";
import { InsertPost, InsertSubmission } from "./api/db/interface";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createPost(formData: FormData) {
  const [db, blobStorage] = [dbFactory(), blobStorageFactory()];
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

export async function getAllPosts(): Promise<Post[]> {
  const db = dbFactory();
  return db.allPosts();
}

export async function getPostById(id: string): Promise<Post> {
  const db = dbFactory();
  return db.postById(id);
}

export async function getSubmissionsById(id: string): Promise<Submission[]> {
  const db = dbFactory();
  return db.submissionsById(id);
}

export async function submitFind(postId: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }

  let client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user.username) {
    throw new Error("unreachable: user without username in curio");
  }

  const [db, blobStorage] = [dbFactory(), blobStorageFactory()];
  const file = formData.get("image");
  const message = extractStringValue(formData, "message");

  if (!(file instanceof File)) {
    throw new Error("Invalid or no file provided");
  }

  const blobKey = await blobStorage.upload(file);

  const submission: InsertSubmission = {
    submittedBy: user.username,
    message,
    blobKey,
  };

  await db.insertSubmission(postId, submission);
}
