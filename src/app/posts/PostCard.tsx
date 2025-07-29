"use client";

import { useState } from "react";
import DifficultyLabel from "../Difficulty";
import { Difficulty } from "../model/difficulty";
import ImageSkeleton from "../components/ImageSkeleton";

type PostCardProps = {
  id: string;
  imageUri: string;
  author: string;
  title: string;
  difficulty: Difficulty;
};

export default function PostCard({
  id,
  imageUri,
  author,
  title,
  difficulty,
}: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <a href={`/post/${id}`} className="w-full md:w-auto md:flex-shrink-0">
      <button className="bg-green text-left rounded-lg overflow-hidden shadow-xl border border-pink-200 transform transition-transform duration-500 hover:scale-105 bg-gray-800 w-full md:w-80">
        <div className="relative">
          {!imageLoaded && (
            <div className="absolute inset-0 z-10">
              <ImageSkeleton fullHeight />
            </div>
          )}
          <img
            src={imageUri}
            alt="preview image"
            className={`w-full object-cover transition-opacity duration-300 ${
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
        <div className="p-4">
          <h3 className="font-semibold">
            {title} by {author}
          </h3>
          <div className="my-2">
            <DifficultyLabel diff={difficulty} />
          </div>
        </div>
      </button>
    </a>
  );
}
