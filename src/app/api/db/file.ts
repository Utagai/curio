import { ObjectId } from "mongodb";
import { Difficulty } from "../../model/difficulty";
import { Post } from "../../model/post";
import Database, { InsertPost } from "./interface";
import * as fs from "fs/promises";
import * as path from "path";

const DEFAULT_DB_PATH = path.join("rsrc", "localdb", "default.json");
const DB_FILE = process.env.CURIO_FILE_DB_PATH || DEFAULT_DB_PATH;
const DB_DIR = path.dirname(DB_FILE);

const initialPosts: Post[] = [
  {
    id: new ObjectId("65892493da75b822c4d872fe").toString(),
    title: "Talk That Talk",
    author: "TWICE",
    description: "TWICE's 2nd full album",
    difficulty: Difficulty.EASY,
    blobKey: "65891f48da75b822c4d872f8",
    submittedAt: new Date(),
    location: {
      lat: 49.7731,
      lng: -70.9701,
    },
    submissions: [
      {
        submittedBy: "tsosis",
        message: "This is a submission",
        blobKey: "65891fa8da75b822c4d872fb",
        date: new Date("December 2, 2023"),
      },
      {
        submittedBy: "Hippo Campus",
        message: "This is a submission as well",
        blobKey: "65891fafda75b822c4d872fc",
        date: new Date("December 3, 2023"),
      },
    ],
  },
  {
    id: new ObjectId("6589249eda75b822c4d872ff").toString(),
    title: "Imbruglia ",
    author: "tsosis",
    description: "Natalie Imbruglia's debut album",
    difficulty: Difficulty.HARD,
    blobKey: "65891f94da75b822c4d872f9",
    submittedAt: new Date(),
    location: {
      lat: 29.3799,
      lng: -98.5702,
    },
    submissions: [
      {
        submittedBy: "tsosis",
        message: "This is a submission yet again",
        blobKey: "65891fb6da75b822c4d872fd",
        date: new Date("November 18, 2023"),
      },
    ],
  },
  {
    id: new ObjectId("658924b1da75b822c4d87300").toString(),
    title: "Understand",
    author: "Hippo Campus",
    description: "Hippo Campus' 3rd album",
    difficulty: Difficulty.MEDIUM,
    blobKey: "65891fa1da75b822c4d872fa",
    submittedAt: new Date(),
    location: {
      lat: 40.7702,
      lng: -74.9703,
    },
    submissions: [],
  },
];

export default class FileDB implements Database {
  private posts: Post[] = [];
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    await fs.mkdir(DB_DIR, { recursive: true });
    const posts = await this.readDB();
    if (posts.length === 0) {
      this.posts = initialPosts;
      await this.writeDB();
    } else {
      this.posts = posts;
    }
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
    };
    this.posts.push(newPost);
    await this.writeDB();
    return newPost.id;
  }
}
