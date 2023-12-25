export default interface BlobStorage {
  // Uploads a blob and returns the key it was uploaded to.
  upload(blob: Blob): Promise<string>;
  // Given a key, fetches the corresponding blob.
  get(key: string): Promise<Blob>;
}
