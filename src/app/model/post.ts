import { Difficulty } from "./difficulty";
import { Latlng } from "./latlng";

export type Post = {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: Difficulty;
  imageUri: string;
  submittedAt: Date;
  location: Latlng;
};
