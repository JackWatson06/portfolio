import { InvalidResult, SuccessfulResult } from "./LoginServiceResult";

export interface LoginService {
  login(password: string): Promise<SuccessfulResult | InvalidResult>;
}
