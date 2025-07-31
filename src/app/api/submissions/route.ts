import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { blobStorageFactory, dbFactory } from "../factory";
import { InsertSubmission } from "../db/interface";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    let client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user.username) {
      return NextResponse.json({ error: "user without username" }, { status: 400 });
    }

    const formData = await request.formData();
    const postId = formData.get("postId") as string;
    const message = formData.get("message") as string;
    const file = formData.get("image") as File;

    if (!postId || !message || !file) {
      return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "invalid file" }, { status: 400 });
    }

    const [db, blobStorage] = [dbFactory(), blobStorageFactory()];
    
    const blobKey = await blobStorage.upload(file);

    const submission: InsertSubmission = {
      submittedBy: user.username,
      message,
      blobKey,
    };

    await db.insertSubmission(postId, submission);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error submitting find:", error);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}