import { MediaUploadParams } from "./DTOSchema";

export interface MediaUploadService {
  findUploadParams(sha1: string): Promise<null | MediaUploadParams>;
}
