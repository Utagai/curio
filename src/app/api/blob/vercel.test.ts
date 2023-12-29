import path from "path";
import VercelBlobStorage from "./vercel";
import { ObjectId } from "mongodb";
import { del } from "@vercel/blob";
import { after } from "node:test";

const uploadedUrls: string[] = [];

class TestWrapperBlobStorage extends VercelBlobStorage {
  static testPrefix = path.join(
    "vercel-blob-storage-tests",
    new ObjectId().toString() // Use a randomly generated subdirectory to avoid clashing with versions of this test running elsewhere.
  );

  constructor() {
    super(TestWrapperBlobStorage.testPrefix);
  }

  async upload(blob: Blob): Promise<string> {
    const url = await super.upload(blob);
    uploadedUrls.push(url);
    return url;
  }
}

afterAll(async () => {
  const promises = uploadedUrls.map((url) => {
    return del(url);
  });
  await Promise.all(promises);
});

test("upload + fetch", async () => {
  const vercelBlobStorage = new TestWrapperBlobStorage();
  const expectedBlob = new Blob(["hello world"]);
  const key = await vercelBlobStorage.upload(expectedBlob);
  const actualBlob = await vercelBlobStorage.get(key);
  const text = await actualBlob.text();
  expect(await actualBlob.text()).toEqual(await expectedBlob.text());
});
