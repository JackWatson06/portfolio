import { TransactionScript as LoginTransactionScript } from "@/auth/login/TransactionScript";
import { TransactionScript as ProjectsTransactionScript } from "@/projects/TransactionScript";
import { NodeServiceLocator } from "./NodeServiceLocator";

export class PortfolioServiceLocator implements NodeServiceLocator {
  constructor(
    public login: LoginTransactionScript,
    public project: ProjectsTransactionScript,
  ) {}
}
