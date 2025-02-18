import { FileSystem } from "./FileSystem";
import {
  access,
  constants,
  mkdir,
  readFile,
  unlink,
  writeFile,
} from "fs/promises";
import { FileHashingAlgorithm } from "./FileHashingAlgorithm";

const DIRECTORY = `${__dirname}/files`;

export class LocalFileSystem implements FileSystem {
  constructor(private file_hash_algo: FileHashingAlgorithm) {}

  async read(hash: string): Promise<Buffer> {
    return await readFile(`${DIRECTORY}/${hash}`);
  }

  async write(data: Buffer): Promise<string> {
    await this.createDirectoryIfNotExists();
    const file_name = this.file_hash_algo.hash(data);
    await writeFile(`${DIRECTORY}/${file_name}`, data);
    return file_name;
  }

  async unlink(hash: string): Promise<void> {
    await unlink(`${DIRECTORY}/${hash}`);
  }

  private async createDirectoryIfNotExists(): Promise<void> {
    try {
      await access(DIRECTORY, constants.W_OK);
    } catch (error) {
      await this.createDirectory();
    }
  }

  private async createDirectory(): Promise<void> {
    await mkdir(DIRECTORY, {
      mode: 0o775,
    });
  }
}
