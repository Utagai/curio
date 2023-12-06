import { Difficulty } from "./difficulty";
import { Post } from "./post";

// Yeah, just play along for now.
const postDB: Post[] = [
  {
    id: "1",
    title: "Talk That Talk",
    author: "TWICE",
    description: "TWICE's 2nd full album",
    difficulty: Difficulty.EASY,
    imageUri: "https://source.unsplash.com/random/400x200",
  },
  {
    id: "2",
    title: "Imbruglia ",
    author: "tsosis",
    description: "Natalie Imbruglia's debut album",
    difficulty: Difficulty.HARD,
    imageUri: "https://source.unsplash.com/random/400x200",
  },
  {
    id: "3",
    title: "Understand",
    author: "Hippo Campus",
    description: "Hippo Campus' 3rd album",
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
