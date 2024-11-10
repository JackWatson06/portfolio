import { TransactionScript as AuthTransactionScript } from "@/auth/TransactionScript";
import { TransactionScript as ProjectsTransactionScript } from "@/projects/TransactionScript";

export interface ServiceLocator {
  readonly auth: AuthTransactionScript;
  readonly project: ProjectsTransactionScript;
}
