import { ObjectId } from "mongodb";
import { Post } from "../../model/post";
import { Submission } from "../../model/submission";
import Database, { InsertPost, InsertSubmission } from "./interface";
import * as fs from "fs/promises";
import * as path from "path";

const DEFAULT_DB_PATH = path.join("rsrc", "localdb", "default.json");
const DB_FILE = process.env.CURIO_FILE_DB_PATH || DEFAULT_DB_PATH;
const DB_DIR = path.dirname(DB_FILE);

export default class FileDB implements Database {
  private posts: Post[] = [];
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    await fs.mkdir(DB_DIR, { recursive: true });
    this.posts = await this.readDB();
  }

  private async readDB(): Promise<Post[]> {
    try {
      const data = await fs.readFile(DB_FILE, "utf-8");
      if (!data) return [];
      return JSON.parse(data, (key, value) => {
        if (key === "submittedAt" || key === "date") {
          return new Date(value);
        }
        return value;
      });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  private async writeDB() {
    await fs.writeFile(DB_FILE, JSON.stringify(this.posts, null, 2));
  }

  async allPosts(): Promise<Post[]> {
    await this.initialized;
    return this.posts;
  }

  async postById(id: string): Promise<Post> {
    await this.initialized;
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      return Promise.reject(`post not found: '${id}'`);
    }
    return post;
  }

  async submissionsById(id: string): Promise<Submission[]> {
    await this.initialized;
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      return Promise.reject(`post not found: '${id}'`);
    }
    return post.submissions || [];
  }

  async insertPost(post: InsertPost): Promise<string> {
    await this.initialized;
    const newPost: Post = {
      ...post,
      id: new ObjectId().toHexString(),
      submissions: [],
      closed: false,
    };
    this.posts.push(newPost);
    await this.writeDB();
    return newPost.id;
  }

  async insertSubmission(postId: string, submission: InsertSubmission): Promise<void> {
    await this.initialized;
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`post not found: '${postId}'`);
    }
    
    const newSubmission: Submission = {
      ...submission,
      date: new Date(),
    };
    
    post.submissions.push(newSubmission);
    await this.writeDB();
  }

  async closePost(id: string): Promise<void> {
    await this.initialized;
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new Error(`post not found: '${id}'`);
    }
    post.closed = true;
    await this.writeDB();
  }
}
