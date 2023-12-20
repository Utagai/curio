import { useRouter } from "next/navigation";
import DifficultyLabel from "../../Difficulty";
import MemoryDB from "../../db/memory";
import Submission from "./Submission";

export default async function Post({ params }: { params: { id: string } }) {
  const db = new MemoryDB();
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
              src={post.imageUri}
              alt="placeholder"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:flex-1 bg-gray-700 p-2 rounded-lg shadow-drop">
            <div className="h-full w-full" id="map">
              <iframe
                className="h-full w-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24201.453993981195!2d-73.87777722063598!3d40.691994681261235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25d0d3ab223cd%3A0x16b11fd586b90f7d!2sRoberta&#39;s!5e0!3m2!1sen!2sus!4v1701649584713!5m2!1sen!2sus"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-2 rounded-lg shadow-drop mb-4">
          <h3 className="font-semibold text-lg md:text-xl mb-2">Description</h3>
          <p className="text-sm md:text-base">{post.description}</p>
        </div>

        <div className="space-y-4">
          {submissions.map((submission) => (
            <Submission key={submission.id} {...submission} />
          ))}
        </div>
      </main>
    </>
  );
}
