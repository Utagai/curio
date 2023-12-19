import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import { Post } from "../model/post";
import Database from "./interface";

const database = "curio";
const collection = "posts";

export default class MongoDB implements Database {
  coll: Collection;

  constructor(uri: string) {
    this.coll = new MongoClient(uri).db(database).collection(collection);
  }

  async allPosts(): Promise<Post[]> {
    return postsFromPipeline(this.coll, []);
  }

  async postById(id: string): Promise<Post> {
    // TODO: Should this helper be replaced with findOne()?
    const posts = await postsFromPipeline(this.coll, [
      { $match: { _id: new ObjectId(id) } },
    ]);
    if (posts.length === 0) {
      return Promise.reject(`post not found: '${id}'`);
    }

    return posts[0];
  }

  submissionsById(id: string): Promise<Submission[]> {
    return this.coll
      .aggregate([{ $match: { postId: id } }, { $project: { submissions: 1 } }])
      .map((doc) => {
        return doc.submissions;
      })
      .toArray();
  }

  async insertPost(post: Post): Promise<void> {
    return this.coll.insertOne(post).then((result) => {
      console.log(`inserted post: ${result.insertedId}`);
    });
  }
}

async function postsFromPipeline(
  coll: Collection,
  pipeline: Document[]
): Promise<Post[]> {
  const cur = coll.aggregate(pipeline);
  const docs = await cur.toArray();
  return docs.map((doc) => {
    return postFromDoc(doc);
  });
}

function postFromDoc(doc: Document): Post {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    blobKey: doc.blobKey,
    author: doc.author,
    difficulty: doc.difficulty,
    location: doc.location,
    submittedAt: doc.submittedAt,
    submissions: doc.submissions,
  };
}
