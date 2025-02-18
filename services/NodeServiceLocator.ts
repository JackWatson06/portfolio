import { TransactionScript as LoginTransactionScript } from "@/auth/login/TransactionScript";
import { TransactionScript as MediaTransactionScript } from "@/media/TransactionScript";
import { TransactionScript as ProjectsTransactionScript } from "@/projects/TransactionScript";

export interface NodeServiceLocator {
  readonly login: LoginTransactionScript;
  readonly media: MediaTransactionScript;
  readonly project: ProjectsTransactionScript;
}
