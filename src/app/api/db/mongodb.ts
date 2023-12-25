import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import { Post } from "../../model/post";
import Database from "./interface";

const database = "curio";
const collection = "posts";

export default class MongoDB implements Database {
  coll: Collection;

  constructor(uri: string) {
    this.coll = new MongoClient(uri).db(database).collection(collection);
  }

  async allPosts(): Promise<Post[]> {
    const cur = this.coll.aggregate([]);
    const docs = await cur.toArray();
    return docs.map((doc) => {
      return postFromDoc(doc);
    });
  }

  async postById(id: string): Promise<Post> {
    const post = await this.coll.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return Promise.reject(`post not found: '${id}'`);
    }

    return postFromDoc(post);
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
