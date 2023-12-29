import { useRouter } from "next/navigation";
import DifficultyLabel from "../../Difficulty";
import Submission from "./Submission";
import MapContainer from "@/app/posts/new/MapContainer";
import { dbFactory } from "@/app/api/factory";

const db = dbFactory();

export default async function Post({ params }: { params: { id: string } }) {
  const post = await db.postById(params.id)!;
  const submissions = await db.submissionsById(params.id);
  return (
    <>
      <main className="py-8 md:px-32 px-4 m-2">
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl">
            <span className="italic">{post.title} </span>
            <span className="text-xs md:text-sm text-gray-400">
              by {post.author}
            </span>
            <span className="p-2">
              <DifficultyLabel diff={post.difficulty} />
            </span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="md:flex-1 bg-gray-700 p-2 rounded-lg shadow-drop mb-4 md:mb-0">
            <img
              src={`/api/post/image?id=${post.id}`}
              alt="placeholder"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <MapContainer onMarkerChange={undefined} clickable={false} />
        </div>

        <div className="bg-gray-800 p-2 rounded-lg shadow-drop mb-4">
          <h3 className="font-semibold text-lg md:text-xl mb-2">Description</h3>
          <p className="text-sm md:text-base">{post.description}</p>
        </div>

        <div className="space-y-4">
          {submissions.map((submission, i) => (
            <Submission key={i} {...submission} />
          ))}
        </div>
      </main>
    </>
  );
}
