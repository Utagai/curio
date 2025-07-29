import PostCard from "./PostCard";
import { getAllPosts } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Posts() {
  const posts = await getAllPosts();
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sortedPosts.map((post) => (
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
    </main>
  );
}
