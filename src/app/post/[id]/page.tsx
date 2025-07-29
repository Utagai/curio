import DifficultyLabel from "../../Difficulty";
import Submission from "./Submission";
import SubmissionForm from "./SubmissionForm";
import PostImage from "./PostImage";
import MapContainer from "@/app/posts/new/MapContainer";
import ClosePostButton from "./ClosePostButton";
import { getPostById, getSubmissionsById } from "@/app/actions";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)!;
  const submissions = await getSubmissionsById(params.id);
  
  // Get current user information
  const { userId } = await auth();
  let currentUsername: string | undefined;
  
  if (userId) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      currentUsername = user.username || undefined;
    } catch (error) {
      // User not found or error getting user info
      currentUsername = undefined;
    }
  }
  return (
    <>
      <main className="py-4 px-4">
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl">
            <span className={`italic ${post.closed ? 'line-through text-gray-500' : ''}`}>{post.title}</span>
            <span> </span>
            <span className="text-xs md:text-sm text-gray-400">
              by {post.author}
            </span>
            <span className="p-2">
              <DifficultyLabel diff={post.difficulty} />
            </span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-4 bg-gray-800 p-6 rounded-lg shadow-xl border border-pink-200">
          <div className="md:flex-1 mb-4 md:mb-0">
            <PostImage blobKey={post.blobKey} alt="Post image" />
          </div>
          <MapContainer clickable={false} initialLocation={post.location} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-pink-200 mb-4">
          <h3 className="font-semibold text-xl md:text-2xl mb-4 italic">
            Description
          </h3>
          <p className="text-base md:text-md text-gray-400">
            {post.description}
          </p>
        </div>

        <SubmissionForm postId={params.id} disabled={post.closed} />

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-pink-200 mb-4">
          <h3 className="font-semibold text-xl md:text-2xl mb-4 italic">
            Submissions
          </h3>
          <div>
            {submissions.map((submission, i) => (
              <Submission key={i} {...submission} />
            ))}
          </div>
        </div>

        <ClosePostButton 
          postId={params.id}
          postAuthor={post.author}
          currentUsername={currentUsername}
          isClosed={post.closed}
        />
      </main>
    </>
  );
}
