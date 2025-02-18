import {
  NotFoundScriptResult,
  ScriptResult,
  ServiceErrorScriptResult,
  SuccessfulScriptResult,
} from "./TransactionScriptResult";
import { MediaCreate, MediaRead } from "./DTOSchema";
import { TransactionScript } from "./TransactionScript";
import { FileSystem } from "@/services/fs/FileSystem";
import { CollectionGateway } from "./CollectionGateway";

export class MediaTransactionScript implements TransactionScript {
  constructor(
    private media_file_system: FileSystem,
    private media_collection_gateway: CollectionGateway,
  ) {}
  async upload(
    media_create: MediaCreate,
  ): Promise<SuccessfulScriptResult | ServiceErrorScriptResult> {
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
        code: ScriptResult.SUCCESS,
      };
    } catch (e) {
      return {
        code: ScriptResult.SERVICE_ERROR,
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
  ): Promise<
    SuccessfulScriptResult | NotFoundScriptResult | ServiceErrorScriptResult
  > {
    const media = await this.media_collection_gateway.find(file_name);

    if (media == null) {
      return {
        code: ScriptResult.NOT_FOUND,
      };
    }

    try {
      await this.media_collection_gateway.delete(file_name);
      await this.media_file_system.unlink(media.hash);
      return {
        code: ScriptResult.SUCCESS,
      };
    } catch (e) {
      return {
        code: ScriptResult.SERVICE_ERROR,
      };
    }
  }
}
