import LocalDB from "../db/local";
import PostCard from "./PostCard";

export default async function Posts() {
  const db = new LocalDB();
  const posts = await db.allPosts();
  console.log(`Got back ${posts.length} posts`);
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
            imageUri={`/api/post/image?id=${post.id}`}
            author={post.author}
          />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-1">
        <a
          href="#"
          className="px-3 py-1 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300"
        >
          1
        </a>
        <a
          href="#"
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          2
        </a>
        <span className="px-3 py-1">...</span>
        <a
          href="#"
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          &gt;
        </a>
      </div>
    </main>
  );
}
