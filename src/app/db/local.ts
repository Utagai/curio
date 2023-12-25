import { MongoClient } from "mongodb";
import { Difficulty } from "../model/difficulty";
import { Post } from "../model/post";
import Database from "./interface";
import MongoDB from "./mongodb";
import { ObjectId } from "mongodb";

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
      lat: 40.7731,
      lng: -73.9701,
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
      lat: 40.7799,
      lng: -73.9702,
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
      lng: -73.9703,
    },
    submissions: [],
  },
];

export default class LocalDB implements Database {
  mongoDB: MongoDB;

  constructor() {
    this.mongoDB = new MongoDB("mongodb://localhost:27017");
  }

  async ensureInit() {
    const promises = initialPosts.map(async (post) => {
      // Insert directly via the MongoClient to avoid dupes.
      const coll = new MongoClient("mongodb://localhost:27017")
        .db("curio")
        .collection("posts");
      console.log(`inserting post ${post.title}`);
      await coll.updateOne(
        { _id: new ObjectId(post.id) },
        { $set: post },
        { upsert: true }
      );
    });
    await Promise.all(promises);
  }

  async allPosts(): Promise<Post[]> {
    await this.ensureInit();
    return this.mongoDB.allPosts();
  }

  async postById(id: string): Promise<Post> {
    await this.ensureInit();
    return this.mongoDB.postById(id);
  }

  async submissionsById(id: string): Promise<Submission[]> {
    await this.ensureInit();
    return this.mongoDB.submissionsById(id);
  }

  async insertPost(post: Post): Promise<void> {
    await this.ensureInit();
    return this.mongoDB.insertPost(post);
  }
}
