export interface TransactionScript {
  validate(token: string): Promise<boolean>;
}
