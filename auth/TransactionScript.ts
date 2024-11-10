import {
  InvalidScriptResult,
  SuccessfulScriptResult,
} from "./TransactionScriptResult";

export interface TransactionScript {
  login(
    password: string,
  ): Promise<SuccessfulScriptResult | InvalidScriptResult>;
  validateSession(token: string): Promise<boolean>;
}
