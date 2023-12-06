import DifficultyLabel, { Difficulty } from "../difficulty";

export default function PostCard(props: {
  imageUri: string;
  author: string;
  title: string;
  difficulty: Difficulty;
}) {
  return (
    <div className="bg-green rounded-lg overflow-hidden card-shadow">
      <img src={props.imageUri} alt="preview image" className="w-full" />
      <div className="p-4">
        <h3 className="font-semibold">
          {props.title} by {props.author}
        </h3>
        <div className="my-2">
          <DifficultyLabel diff={props.difficulty} />
        </div>
      </div>
    </div>
  );
}
