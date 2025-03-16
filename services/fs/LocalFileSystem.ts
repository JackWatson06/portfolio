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
import { Logger } from "../logging/Logger";
import { fileURLToPath } from "url";
import path from "path";

const FILE_NAME = fileURLToPath(import.meta.url);
const DIRECTORY = `${path.dirname(FILE_NAME)}/files`;

export class LocalFileSystem implements FileSystem {
  constructor(
    private file_hash_algo: FileHashingAlgorithm,
    private logger: Logger,
  ) {}

  async read(hash: string): Promise<Buffer> {
    try {
      return await readFile(`${DIRECTORY}/${hash}`);
    } catch (e) {
      this.logger.error(
        `LocalFileSystem::read Could not read the file at directory: ${DIRECTORY}/${hash}`,
      );
      this.logger.error((e as NodeJS.ErrnoException).message);
      throw e;
    }
  }

  async write(data: Buffer): Promise<string> {
    try {
      await this.createDirectoryIfNotExists();
      const file_name = this.file_hash_algo.hash(data);
      await writeFile(`${DIRECTORY}/${file_name}`, data);
      return file_name;
    } catch (e) {
      this.logger.error(
        `LocalFileSystem::write Could not write a file to directory: ${DIRECTORY}`,
      );
      this.logger.error((e as NodeJS.ErrnoException).message);
      throw e;
    }
  }

  async unlink(hash: string): Promise<void> {
    try {
      await unlink(`${DIRECTORY}/${hash}`);
    } catch (e) {
      this.logger.error(
        `LocalFileSystem::unlink Could not delete the file at directory: ${DIRECTORY}/${hash}`,
      );
      this.logger.error((e as NodeJS.ErrnoException).message);
      throw e;
    }
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
