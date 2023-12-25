import { Post } from "../../model/post";

export default interface Database {
  allPosts(): Promise<Post[]>;
  postById(id: string): Promise<Post>;
  submissionsById(id: string): Promise<Submission[]>;
  insertPost(post: Post): Promise<void>;
}
