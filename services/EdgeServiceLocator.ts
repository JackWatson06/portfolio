import { TokenService } from "@/auth/token/TokenService";

export interface EdgeServiceLocator {
  readonly token: TokenService;
}
