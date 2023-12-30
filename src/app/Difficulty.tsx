import { Difficulty } from "./model/difficulty";

export const difficultyLabelUtilityClasses =
  "px-2 py-1 rounded text-xs md:text-sm font-bold";

export default function DifficultyLabel(props: { diff: Difficulty }) {
  return (
    <span className={`${props.diff}-label ${difficultyLabelUtilityClasses}`}>
      {props.diff.toUpperCase()}
    </span>
  );
}
