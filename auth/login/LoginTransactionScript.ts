import { ExpiresCalculator } from "./ExpiresCalculator";
import { HashingAlgorithm } from "./HashingAlgorithm";
import { SessionAlgorithm } from "../services/SessionAlgorithm";
import { LoginService } from "./LoginService";
import {
  InvalidResult,
  ServiceResult,
  SuccessfulResult,
} from "./LoginServiceResult";

export type AuthSettings = {
  hashed_password: string;
  environment: string;
};

export class LoginTransactionScript implements LoginService {
  constructor(
    private settings: AuthSettings,
    private session_algorithm: SessionAlgorithm,
    private hashing_algorithm: HashingAlgorithm,
    private expires_calculator: ExpiresCalculator,
  ) {}

  async login(password: string): Promise<SuccessfulResult | InvalidResult> {
    const hashed_password = await this.hashing_algorithm.hash(password);

    if (hashed_password != this.settings.hashed_password) {
      return {
        code: ServiceResult.INVALID,
      };
    }

    const expiration_time = this.expires_calculator.getExpirationTime();
    return {
      code: ServiceResult.SUCCESS,
      token: await this.session_algorithm.create(expiration_time),
      expires: expiration_time,
      secure: this.settings.environment != "development",
    };
  }
}
