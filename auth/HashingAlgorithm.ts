
export interface HashingAlgorithm {
  hash(password: string): Promise<string>;
}
