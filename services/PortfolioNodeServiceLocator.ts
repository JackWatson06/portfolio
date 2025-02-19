import { LoginService } from "@/auth/login/LoginService";
import { MediaService } from "@/media/MediaService";
import { ProjectService } from "@/projects/ProjectService";
import { NodeServiceLocator } from "./NodeServiceLocator";
import { MediaUploadService } from "@/media/MediaUploadService";

export class PortfolioServiceLocator implements NodeServiceLocator {
  constructor(
    public login: LoginService,
    public media: MediaService,
    public media_upload: MediaUploadService,
    public project: ProjectService,
  ) {}
}
