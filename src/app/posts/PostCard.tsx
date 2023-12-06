import DifficultyLabel from "../Difficulty";
import { Difficulty } from "../model/difficulty";

export default function PostCard(props: {
  id: string;
  imageUri: string;
  author: string;
  title: string;
  difficulty: Difficulty;
}) {
  return (
    <a href={`/post/${props.id}`}>
      <button className="bg-green text-left rounded-lg overflow-hidden card-shadow transform transition-transform duration-500 hover:scale-105">
        <img src={props.imageUri} alt="preview image" className="w-full" />
        <div className="p-4">
          <h3 className="font-semibold">
            {props.title} by {props.author}
          </h3>
          <div className="my-2">
            <DifficultyLabel diff={props.difficulty} />
          </div>
        </div>
      </button>
    </a>
  );
}
