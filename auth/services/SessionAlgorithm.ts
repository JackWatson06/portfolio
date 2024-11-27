export interface SessionAlgorithm {
  create(expiration_date: number): Promise<string>;
  validate(token: string): Promise<boolean>;
}
