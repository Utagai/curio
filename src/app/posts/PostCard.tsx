import DifficultyLabel from "../Difficulty";
import { Difficulty } from "../model/difficulty";

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
  return (
    <a href={`/post/${id}`}>
      <button className="bg-green text-left rounded-lg overflow-hidden shadow-xl border border-pink-200 transform transition-transform duration-500 hover:scale-105 bg-gray-800">
        <img src={imageUri} alt="preview image" className="w-full" />
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
