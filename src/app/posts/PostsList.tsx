"use client";

import { useState } from "react";
import { Post } from "@/app/model/post";
import PostCard from "./PostCard";
import Switch from "react-switch";

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const [showClosed, setShowClosed] = useState(false);

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  const filteredPosts = showClosed 
    ? sortedPosts 
    : sortedPosts.filter(post => !post.closed);

  return (
    <>
      <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-4 mb-8">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            difficulty={post.difficulty}
            imageUri={`/api/post/image?blobKey=${post.blobKey}`}
            author={post.author}
            closed={post.closed}
          />
        ))}
      </div>
      <div className="flex justify-center items-center gap-3 mb-6">
        <span className="text-sm font-bold">Open</span>
        <Switch
          checked={showClosed}
          onChange={setShowClosed}
          onColor="#ec4899"
          onHandleColor="#ffffff"
          offColor="#4b5563"
          offHandleColor="#ffffff"
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 3px rgba(236, 72, 153, 0.2)"
          height={24}
          width={48}
        />
        <span className="text-sm font-bold">Closed</span>
      </div>
    </>
  );
}