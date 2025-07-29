"use client";

import { useState } from "react";
import ImageSkeleton from "../../components/ImageSkeleton";

type PostImageProps = {
  blobKey: string;
  alt?: string;
};

export default function PostImage({
  blobKey,
  alt = "Not Found",
}: PostImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUri = `/api/post/image?blobKey=${blobKey}`;

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className="absolute inset-0 z-10">
          <ImageSkeleton height="h-full" />
        </div>
      )}
      <img
        src={imageUri}
        alt={alt}
        className={`w-full h-auto rounded-lg transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
        ref={(img) => {
          if (img && img.complete && img.naturalHeight !== 0) {
            setImageLoaded(true);
          }
        }}
      />
    </div>
  );
}

