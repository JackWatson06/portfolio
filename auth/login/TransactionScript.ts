import {
  InvalidScriptResult,
  SuccessfulScriptResult,
} from "./TransactionScriptResult";

export interface TransactionScript {
  login(
    password: string,
  ): Promise<SuccessfulScriptResult | InvalidScriptResult>;
}
