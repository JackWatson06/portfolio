import { BlobStorage } from "@/services/fs/BlobStorage";
import { MediaUploadParams } from "./DTOSchema";
import { MediaUploadService } from "./MediaUploadService";

export class MediaUploadTransactionScript implements MediaUploadService {
  constructor(private blob_storage_service: BlobStorage) {}

  async findUploadParams(sha1: string): Promise<null | MediaUploadParams> {
    try {
      return await this.blob_storage_service.generateHTTPParams(sha1);
    } catch (error) {
      return null;
    }
  }
}
