import { Post } from "../../model/post";
import { PushSubscriptionRecord } from "../../model/pushSubscription";
import { Submission } from "../../model/submission";

export type InsertPost = Omit<Post, "id" | "closed">;
export type InsertSubmission = Omit<Submission, "date">;

export default interface Database {
  allPosts(): Promise<Post[]>;
  postById(id: string): Promise<Post>;
  submissionsById(id: string): Promise<Submission[]>;
  insertPost(post: InsertPost): Promise<string>;
  insertSubmission(postId: string, submission: InsertSubmission): Promise<void>;
  closePost(id: string): Promise<void>;
  savePushSubscription(subscription: PushSubscriptionRecord): Promise<void>;
  deletePushSubscription(endpoint: string): Promise<void>;
  pushSubscriptionsFor(username: string): Promise<PushSubscriptionRecord[]>;
  allPushSubscriptions(): Promise<PushSubscriptionRecord[]>;
}
