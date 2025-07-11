import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import { Post } from "../../model/post";
import Database, { InsertPost } from "./interface";

const database = "curio";
const collection = "posts";

let client: MongoClient | null = null;

async function getCollection(): Promise<Collection> {
  if (!client) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set");
    }
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db(database).collection(collection);
}

export default class MongoDB implements Database {
  async allPosts(): Promise<Post[]> {
    const coll = await getCollection();
    const cur = coll.aggregate([]);
    const docs = await cur.toArray();
    return docs.map((doc) => {
      return postFromDoc(doc);
    });
  }

  async postById(id: string): Promise<Post> {
    const coll = await getCollection();
    const post = await coll.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return Promise.reject(`post not found: '${id}'`);
    }

    return postFromDoc(post);
  }

  async submissionsById(id: string): Promise<Submission[]> {
    const coll = await getCollection();
    return coll
      .aggregate([{ $match: { postId: id } }, { $project: { submissions: 1 } }])
      .map((doc) => {
        return doc.submissions;
      })
      .toArray();
  }

  async insertPost(post: InsertPost): Promise<string> {
    const coll = await getCollection();
    return coll.insertOne(post).then((result) => {
      console.log(`inserted post: ${result.insertedId}`);
      return result.insertedId.toHexString();
    });
  }
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
