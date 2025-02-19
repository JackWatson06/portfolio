import {
  NotFoundResult,
  ServiceResult,
  ServiceErrorResult,
  SuccessfulResult,
} from "./MediaServiceResult";
import { MediaCreate, MediaRead } from "./DTOSchema";
import { MediaService } from "./MediaService";
import { FileSystem } from "@/services/fs/FileSystem";
import { CollectionGateway } from "./CollectionGateway";

export class MediaTransactionScript implements MediaService {
  constructor(
    private media_file_system: FileSystem,
    private media_collection_gateway: CollectionGateway,
  ) {}
  async upload(
    media_create: MediaCreate,
  ): Promise<SuccessfulResult | ServiceErrorResult> {
    try {
      const hash = await this.media_file_system.write(media_create.data);
      await this.media_collection_gateway.insert({
        hash: hash,
        file_name: media_create.file_name,
        content_type: media_create.content_type,
        size: media_create.size,
        uploaded_at: new Date(),
      });

      return {
        code: ServiceResult.SUCCESS,
      };
    } catch (e) {
      return {
        code: ServiceResult.SERVICE_ERROR,
      };
    }
  }

  async read(file_name: string): Promise<MediaRead | null> {
    const media = await this.media_collection_gateway.find(file_name);

    if (media == null) {
      return null;
    }

    try {
      const file_data = await this.media_file_system.read(media.hash);

      return {
        data: file_data,
        hash: media.hash,
        file_name: media.file_name,
        content_type: media.content_type,
        size: media.size,
        uploaded_at: media.uploaded_at,
      };
    } catch (e) {
      return null;
    }
  }

  async delete(
    file_name: string,
  ): Promise<SuccessfulResult | NotFoundResult | ServiceErrorResult> {
    const media = await this.media_collection_gateway.find(file_name);

    if (media == null) {
      return {
        code: ServiceResult.NOT_FOUND,
      };
    }

    try {
      await this.media_collection_gateway.delete(file_name);
      await this.media_file_system.unlink(media.hash);
      return {
        code: ServiceResult.SUCCESS,
      };
    } catch (e) {
      return {
        code: ServiceResult.SERVICE_ERROR,
      };
    }
  }
}
