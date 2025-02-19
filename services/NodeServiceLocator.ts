import { LoginService } from "@/auth/login/LoginService";
import { MediaService } from "@/media/MediaService";
import { MediaUploadService } from "@/media/MediaUploadService";
import { ProjectService } from "@/projects/ProjectService";

export interface NodeServiceLocator {
  readonly login: LoginService;
  readonly media: MediaService;
  readonly media_upload: MediaUploadService;
  readonly project: ProjectService;
}
