import { MediaService } from "@/media/MediaService";
import {
  BlobStorage,
  BlobStorageResult,
  UploadHTTPParams,
} from "./BlobStorage";
import { ServiceResult } from "@/media/MediaServiceResult";

export class LocalBlobStorage implements BlobStorage {
  constructor(
    private port: number,
    private public_origin: string,
    private media_service: MediaService,
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
  async removeBlob(file_name: string): Promise<BlobStorageResult> {
    const delete_result = await this.media_service.delete(file_name);

    if (delete_result.code != ServiceResult.SUCCESS) {
      return BlobStorageResult.ERROR;
    }

    return BlobStorageResult.SUCCESS;
  }
}
