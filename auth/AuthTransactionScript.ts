import { ExpiresCalculator } from "./ExpiresCalculator";
import { HashingAlgorithm } from "./HashingAlgorithm";
import { SessionAlgorithm } from "./SessionAlgorithm";
import { TransactionScript } from "./TransactionScript";
import {
  InvalidScriptResult,
  ScriptResult,
  SuccessfulScriptResult,
} from "./TransactionScriptResult";

export type AuthSettings = {
  hashed_password: string,
  environment: string
}

export class AuthTransactionScript implements TransactionScript {
  constructor(
    private settings: AuthSettings,
    private session_algorithm: SessionAlgorithm,
    private hashing_algorithm: HashingAlgorithm,
    private expires_calculator: ExpiresCalculator
  ) {}

  async login(
    password: string,
  ): Promise<SuccessfulScriptResult | InvalidScriptResult> {
    const hashed_password = await this.hashing_algorithm.hash(password);

    if (hashed_password != this.settings.hashed_password) {
      return {
        code: ScriptResult.INVALID,
      };
    }

    const expiration_time = this.expires_calculator.getExpirationTime();
    return {
      code: ScriptResult.SUCCESS,
      token: await this.session_algorithm.create(expiration_time),
      expires: expiration_time,
      secure: this.settings.environment != "development"
    };
  }

  validateSession(token: string): Promise<boolean> {
    return this.session_algorithm.validate(token);
  }
}
