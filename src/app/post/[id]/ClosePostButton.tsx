"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/app/posts/new/SubmitButton";
import { closePost } from "@/app/actions";

interface ClosePostButtonProps {
  postId: string;
  postAuthor: string;
  currentUsername?: string;
  isClosed: boolean;
}

export default function ClosePostButton({ 
  postId, 
  postAuthor, 
  currentUsername,
  isClosed 
}: ClosePostButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Don't show the button if the post is already closed or if the user is not the author
  if (isClosed || !currentUsername || currentUsername !== postAuthor) {
    return null;
  }

  const handleClose = async () => {
    if (!confirm("Are you sure you want to close this post? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    try {
      await closePost(postId);
      router.refresh();
    } catch (error) {
      console.error("Failed to close post:", error);
      alert("Failed to close post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <SubmitButton
        onClick={handleClose}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Close Post
      </SubmitButton>
    </div>
  );
}