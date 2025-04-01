import { BlobStorage, UploadHTTPParams } from "./BlobStorage";

export class LocalBlobStorage implements BlobStorage {
  constructor(
    private port: number,
    private public_origin: string,
  ) {}

  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    return {
      upload: {
        url: `http://localhost:${this.port}/api/media`,
        method: "POST",
        headers: {
          "Portfolio-File-Name": sha1,
        },
      },
      public_url: `${this.public_origin}/api/media/${sha1}`,
    };
  }
  removeBlob(file_name: string): void {}
}
