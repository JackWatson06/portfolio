import { SessionAlgorithm } from "../services/SessionAlgorithm";
import { TokenService } from "./TokenService";

export class TokenTransactionScript implements TokenService {
  constructor(private session_algorithm: SessionAlgorithm) {}

  validate(token: string): Promise<boolean> {
    return this.session_algorithm.validate(token);
  }
}
