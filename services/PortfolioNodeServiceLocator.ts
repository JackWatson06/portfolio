import { LoginService } from "@/auth/login/LoginService";
import { MediaService } from "@/media/MediaService";
import { ProjectService } from "@/projects/ProjectService";
import { NodeServiceLocator } from "./NodeServiceLocator";
import { MediaUploadService } from "@/media/upload/MediaUploadService";
import { TokenService } from "@/auth/token/TokenService";

export class PortfolioServiceLocator implements NodeServiceLocator {
  constructor(
    public login: LoginService,
    public token: TokenService,
    public media: MediaService,
    public media_upload: MediaUploadService,
    public project: ProjectService,
  ) {}
}
