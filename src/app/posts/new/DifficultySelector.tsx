import React, { useState } from "react";
import DifficultyLabel, {
  difficultyLabelUtilityClasses,
} from "@/app/Difficulty";
import { Difficulty } from "@/app/model/difficulty";

export default function DifficultySelector(props: {
  onSelect: (diff: Difficulty) => void;
}) {
  const marginUtilityClass = "m-1";
  const [activeButton, setActiveButton] = useState("");

  const handleButtonClick = (difficulty: Difficulty) => {
    setActiveButton(difficulty);
    props.onSelect(difficulty);
  };

  return (
    <span>
      <span>
        <button
          className={`easy-label ${marginUtilityClass} ${
            activeButton === "easy" ? "easy-label-active" : ""
          } ${difficultyLabelUtilityClasses}`}
          onClick={() => handleButtonClick(Difficulty.EASY)}
        >
          EASY
        </button>
      </span>

      <span>
        <button
          className={`medium-label ${marginUtilityClass} ${
            activeButton === "medium" ? "medium-label-active" : ""
          } ${difficultyLabelUtilityClasses}`}
          onClick={() => handleButtonClick(Difficulty.MEDIUM)}
        >
          MEDIUM
        </button>
      </span>

      <span>
        <button
          className={`hard-label ${marginUtilityClass} ${
            activeButton === "hard" ? "hard-label-active" : ""
          } ${difficultyLabelUtilityClasses}`}
          onClick={() => handleButtonClick(Difficulty.HARD)}
        >
          HARD
        </button>
      </span>
    </span>
  );
}
