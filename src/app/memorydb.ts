import { Difficulty } from "./Difficulty";
import { Post } from "./post";

// Yeah, just play along for now.
const postTable: Post[] = [
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

const submissionTable: Submission[] = [
  {
    id: "1",
    postId: "1",
    submittedBy: "tsosis",
    message: "This is a submission",
    imageUri: "https://source.unsplash.com/random/400x200",
    date: new Date("December 2, 2023"),
  },
  {
    id: "2",
    postId: "1",
    submittedBy: "Hippo Campus",
    message: "This is a submission as well",
    imageUri: "https://source.unsplash.com/random/400x200",
    date: new Date("December 3, 2023"),
  },
  {
    id: "3",
    postId: "2",
    submittedBy: "tsosis",
    message: "This is a submission yet again",
    imageUri: "https://source.unsplash.com/random/400x200",
    date: new Date("November 18, 2023"),
  },
];

export function allPosts(): Post[] {
  return postTable;
}

export function getPostById(id: string): Post | undefined {
  return postTable.find((post) => post.id === id);
}

export function getSubmissionsForPost(id: string): Submission[] {
  return submissionTable.filter((submission) => submission.postId === id);
}
