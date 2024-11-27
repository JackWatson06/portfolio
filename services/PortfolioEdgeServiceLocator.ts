import { TransactionScript as TokenTransactionScript } from "@/auth/token/TransactionScript";
import { EdgeServiceLocator } from "./EdgeServiceLocator";

export class PortfolioEdgeServiceLocator implements EdgeServiceLocator {
  constructor(readonly token: TokenTransactionScript) {}
}
