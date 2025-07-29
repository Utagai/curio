import PostsList from "./PostsList";
import { getAllPosts } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Posts() {
  const posts = await getAllPosts();
  
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Posts</h2>
      <PostsList posts={posts} />
    </main>
  );
}
