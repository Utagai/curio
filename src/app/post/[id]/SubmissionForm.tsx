"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/app/posts/new/SubmitButton";
import { compressImage } from "@/utils/imageCompression";
import { submitFind } from "@/app/actions";

type SubmissionFormProps = {
  postId: string;
  disabled?: boolean;
};

export default function SubmissionForm({
  postId,
  disabled = false,
}: SubmissionFormProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    "https://placehold.co/200x150?text=Upload+Image",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!imageFile || !message.trim()) {
      alert("Please provide both an image and a message.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Compress the image before uploading
      const compressedImage = await compressImage(imageFile, {
        maxWidth: 1500,
        maxHeight: 1500,
        quality: 0.9,
        outputFormat: 'image/jpeg'
      });

      const formData = new FormData();
      formData.append("image", compressedImage);
      formData.append("message", message);

      await submitFind(postId, formData);

      // Reset form
      setImageFile(null);
      setMessage("");
      setImageSrc("https://placehold.co/200x150?text=Upload+Image");

      // Refresh the page to show the new submission
      router.refresh();
    } catch (error) {
      console.error("Error submitting find:", error);
      alert("Failed to submit your find. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (disabled) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-pink-200 mb-4">
        <h3 className="font-semibold text-xl md:text-2xl mb-3 italic text-gray-500">
          Submit Your Find
        </h3>
        <p className="text-gray-400 text-center py-8">
          This post is closed and no longer accepting submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-pink-200 mb-4">
      <h3 className="font-semibold text-xl md:text-2xl mb-3 italic">
        Submit Your Find
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Image Upload */}
        <div>
          <div
            className={`w-full rounded border-2 border-dashed border-gray-600 cursor-pointer ${
              imageFile ? "h-auto" : "h-64 overflow-hidden"
            }`}
          >
            <img
              src={imageSrc}
              alt="Upload"
              className={`w-full object-cover ${
                imageFile ? "h-auto" : "h-full"
              }`}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Message Input */}
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-10 p-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            placeholder="Any comments?"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <SubmitButton
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !imageFile || !message.trim()}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Find"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
