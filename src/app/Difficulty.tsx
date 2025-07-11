import { Difficulty } from "./model/difficulty";

export const difficultyLabelUtilityClasses =
  "px-2 py-1 rounded text-xs md:text-sm font-bold";

type DifficultyLabelProps = { diff: Difficulty };

export default function DifficultyLabel({ diff }: DifficultyLabelProps) {
  return (
    <span className={`${diff}-label ${difficultyLabelUtilityClasses}`}>
      {diff.toUpperCase()}
    </span>
  );
}
