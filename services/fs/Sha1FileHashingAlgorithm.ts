import { FileHashingAlgorithm } from "./FileHashingAlgorithm";
import { createHash } from "node:crypto";

export class Sha1FileHashingAlgorithm implements FileHashingAlgorithm {
  hash(file_buffer: Buffer): string {
    const sha1 = createHash("sha1");
    sha1.update(file_buffer);
    return sha1.digest("hex");
  }
}
