export interface FileHashingAlgorithm {
  hash(file_buffer: Buffer): string;
}
