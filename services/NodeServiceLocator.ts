import { LoginService } from "@/auth/login/LoginService";
import { TokenService } from "@/auth/token/TokenService";
import { MediaService } from "@/media/MediaService";
import { MediaUploadService } from "@/media/upload/MediaUploadService";
import { ProjectService } from "@/projects/ProjectService";

export interface NodeServiceLocator {
  readonly login: LoginService;
  readonly token: TokenService;
  readonly media: MediaService;
  readonly media_upload: MediaUploadService;
  readonly project: ProjectService;
}
