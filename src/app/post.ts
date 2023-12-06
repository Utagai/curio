import { Difficulty } from "./difficulty";

export type Post = {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: Difficulty;
  imageUri: string;
};
