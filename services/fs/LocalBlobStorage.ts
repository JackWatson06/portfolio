import { BlobStorage, UploadHTTPParams } from "./BlobStorage";

export class LocalBlobStorage implements BlobStorage {
  constructor(private port: number) {}

  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    return {
      upload: {
        url: `http://localhost:${this.port}/api/media`,
        method: "POST",
        headers: {
          "Portfolio-File-Name": sha1,
        },
      },
      public_url: `http://localhost:${this.port}/api/media/${sha1}`,
    };
  }
  removeBlob(file_name: string): void {}
}
