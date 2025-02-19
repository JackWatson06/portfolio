export interface TokenService {
  validate(token: string): Promise<boolean>;
}
