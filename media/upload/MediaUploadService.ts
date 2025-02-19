import { MediaUploadParams } from "./MediaUploadDTOSchema";

export interface MediaUploadService {
  findUploadParams(sha1: string): Promise<null | MediaUploadParams>;
}
