import { Difficulty } from "./difficulty";

export default type Post = {
  id: string;
  title: string;
  author: string;
  difficulty: Difficulty;
  imageUri: string;
};
