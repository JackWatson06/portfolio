import { MediaCreate, MediaRead } from "../DTOSchema";
import { MediaService } from "../MediaService";
import {
  NotFoundResult,
  ServiceErrorResult,
  ServiceResult,
  SuccessfulResult,
} from "../MediaServiceResult";

export class MockMediaService implements MediaService {
  public last_upload: MediaCreate | undefined = undefined;
  public last_read: string = "";
  public last_delete: string = "";

  public upload_return: SuccessfulResult | ServiceErrorResult = {
    code: ServiceResult.SUCCESS,
  };
  public read_return: MediaRead | null = null;
  public delete_return: SuccessfulResult | NotFoundResult | ServiceErrorResult =
    { code: ServiceResult.SUCCESS };

  async upload(
    media_create: MediaCreate,
  ): Promise<SuccessfulResult | ServiceErrorResult> {
    this.last_upload = media_create;
    return this.upload_return;
  }

  async read(file_name: string): Promise<MediaRead | null> {
    this.last_read = file_name;
    return this.read_return;
  }
  async delete(
    file_name: string,
  ): Promise<SuccessfulResult | NotFoundResult | ServiceErrorResult> {
    this.last_delete = file_name;
    return this.delete_return;
  }
}
