"use client";

import { ChangeEvent, useRef, useState } from "react";

type UploadImageButtonProps = { onUpload: (file: File) => void };

export default function UploadImageButton({
  onUpload,
}: UploadImageButtonProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    "https://placehold.co/600x300?text=Upload",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUpload(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-auto rounded-lg border-4 border-dashed border-darkaccent cursor-pointer">
      <img
        src={imageSrc}
        alt="Upload"
        className="w-full h-auto object-cover dim"
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        id="fileInput"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
