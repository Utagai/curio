import { Post } from "../../model/post";
import { Submission } from "../../model/submission";

export type InsertPost = Omit<Post, "id">;
export type InsertSubmission = Omit<Submission, "date">;

export default interface Database {
  allPosts(): Promise<Post[]>;
  postById(id: string): Promise<Post>;
  submissionsById(id: string): Promise<Submission[]>;
  insertPost(post: InsertPost): Promise<string>;
  insertSubmission(postId: string, submission: InsertSubmission): Promise<void>;
}
