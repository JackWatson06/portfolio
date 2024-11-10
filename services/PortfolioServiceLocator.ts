import { TransactionScript as AuthTransactionScript } from "@/auth/TransactionScript";
import { TransactionScript as ProjectsTransactionScript } from "@/projects/TransactionScript";
import { ServiceLocator } from "./ServiceLocator";

export class PortfolioServiceLocator implements ServiceLocator {
  constructor(
    public auth: AuthTransactionScript,
    public project: ProjectsTransactionScript,
  ) {}
}
