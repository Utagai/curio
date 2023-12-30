import { Post } from "../../model/post";

export type InsertPost = Omit<Post, "id">;

export default interface Database {
  allPosts(): Promise<Post[]>;
  postById(id: string): Promise<Post>;
  submissionsById(id: string): Promise<Submission[]>;
  insertPost(post: InsertPost): Promise<string>;
}
