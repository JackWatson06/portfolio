import { FileHashingAlgorithm } from "../FileHashingAlgorithm";

export class MockFileHashingAlgorithm implements FileHashingAlgorithm {
  hash(buffer: Buffer): string {
    return "testing";
  }
}
