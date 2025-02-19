import { TokenService } from "@/auth/token/TokenService";
import { EdgeServiceLocator } from "./EdgeServiceLocator";

export class PortfolioEdgeServiceLocator implements EdgeServiceLocator {
  constructor(readonly token: TokenService) {}
}
