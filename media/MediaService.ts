import {
  NotFoundResult,
  ServiceErrorResult,
  SuccessfulResult,
} from "./MediaServiceResult";
import { MediaCreate, MediaRead } from "./DTOSchema";

export interface MediaService {
  upload(
    media_create: MediaCreate,
  ): Promise<SuccessfulResult | ServiceErrorResult>;

  read(file_name: string): Promise<MediaRead | null>;
  delete(
    file_name: string,
  ): Promise<SuccessfulResult | NotFoundResult | ServiceErrorResult>;
}
