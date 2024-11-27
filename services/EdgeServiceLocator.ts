import { TransactionScript as TokenTransactionScript } from "@/auth/token/TransactionScript";

export interface EdgeServiceLocator {
  readonly token: TokenTransactionScript
}
