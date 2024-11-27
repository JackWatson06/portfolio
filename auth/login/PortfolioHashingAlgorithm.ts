import { HashingAlgorithm } from "./HashingAlgorithm";
import { scrypt } from "node:crypto";

export class PortfolioHashingAlgorithm implements HashingAlgorithm {
  constructor(private salt: string) {}

  hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      scrypt(password, this.salt, 64, (error, key) => {
        if (error != null) {
          return reject(error.message);
        }

        resolve(key.toString("hex"));
      });
    });
  }
}
