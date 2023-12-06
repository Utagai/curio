import { Difficulty } from "./model/difficulty";

export default function DifficultyLabel(props: { diff: Difficulty }) {
  return (
    <span>
      <div
        className={`${props.diff}-label inline px-2 py-1 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
      >
        {props.diff.toUpperCase()}
      </div>
    </span>
  );
}
