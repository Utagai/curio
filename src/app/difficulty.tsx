export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export default function DifficultyLabel(props: { diff: Difficulty }) {
  return (
    <span className="m-2">
      <div
        className={`${props.diff}-label inline px-2 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
      >
        {props.diff}
      </div>
    </span>
  );
}
