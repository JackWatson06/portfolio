import {
  BlobStorage,
  BlobStorageResult,
  UploadHTTPParams,
} from "../BlobStorage";

export class MockBlobStorage implements BlobStorage {
  public last_generate_http_params: string = "";
  public last_remove_blob: string = "";

  public remove_blob_return: BlobStorageResult = BlobStorageResult.SUCCESS;

  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    return {
      upload: {
        url: "https://testing.com",
        method: "POST",
        headers: {},
      },
      public_url: "https://testing.com",
    };
  }

  async removeBlob(file_name: string) {
    this.last_remove_blob = file_name;
    return this.remove_blob_return;
  }
}
