import { Difficulty } from "./difficulty";
import { Post } from "./post";

// Yeah, just play along for now.
const postDB: Post[] = [
  {
    id: "1",
    title: "Talk That Talk",
    author: "TWICE",
    difficulty: Difficulty.EASY,
    imageUri: "https://source.unsplash.com/random/400x200",
  },
  {
    id: "2",
    title: "Imbruglia ",
    author: "tsosis",
    difficulty: Difficulty.HARD,
    imageUri: "https://source.unsplash.com/random/400x200",
  },
  {
    id: "3",
    title: "Understand",
    author: "Hippo Campus",
    difficulty: Difficulty.MEDIUM,
    imageUri: "https://source.unsplash.com/random/400x200",
  },
];

export function allPosts(): Post[] {
  return postDB;
}

export function getPostById(id: string): Post | undefined {
  return postDB.find((post) => post.id === id);
}
