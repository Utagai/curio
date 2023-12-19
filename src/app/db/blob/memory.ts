const blobStorageURLs: { [key: string]: string } = {
  "1": "https://i.imgur.com/QFJAeBH.png",
  "2": "https://i.imgur.com/BSN8clp.png",
  "3": "https://i.imgur.com/AZzSJ2C.png",
};

function upload(key: string, _: Blob): string {
  switch (key) {
    case "1":
    case "2":
    case "3":
      return blobStorageURLs[key];
    default:
      throw new Error(`invalid key: '${key}'`);
  }
}
