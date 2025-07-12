import PostCard from "./PostCard";
import { getAllPosts } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Posts() {
  const posts = await getAllPosts();
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            difficulty={post.difficulty}
            imageUri={`/api/post/image?blobKey=${post.blobKey}`}
            author={post.author}
          />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-1">
        <a
          href="#"
          className="px-3 py-1 bg-gray-800 text-white rounded-lg border border-pink-200 shadow-xl hover:bg-gray-700"
        >
          1
        </a>
        <a
          href="#"
          className="px-3 py-1 bg-gray-800 text-white rounded-lg border border-pink-200 shadow-xl hover:bg-gray-700"
        >
          2
        </a>
        <span className="px-3 py-1 text-pink-200">...</span>
        <a
          href="#"
          className="px-3 py-1 bg-gray-800 text-white rounded-lg border border-pink-200 shadow-xl hover:bg-gray-700"
        >
          &gt;
        </a>
      </div>
    </main>
  );
}
