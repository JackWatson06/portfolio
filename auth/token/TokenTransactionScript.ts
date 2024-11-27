import { SessionAlgorithm } from "../services/SessionAlgorithm";
import { TransactionScript } from "./TransactionScript";

export class TokenTransactionScript implements TransactionScript {
  constructor(private session_algorithm: SessionAlgorithm) {}
  
  validate(token: string): Promise<boolean> {
    return this.session_algorithm.validate(token);
  }
}
