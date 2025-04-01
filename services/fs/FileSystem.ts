import { Buffer } from "buffer";

export interface FileSystem {
  read(hash: string): Promise<Buffer>;
  write(data: Buffer): Promise<string>;
  unlink(hash: string): Promise<void>;
}
