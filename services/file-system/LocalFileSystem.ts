import { FileSystem } from "./FileSystem";
import {
  access,
  constants,
  mkdir,
  readFile,
  unlink,
  writeFile,
} from "fs/promises";
import { createHash } from "node:crypto";

export class LocalFileSystem implements FileSystem {
  private directory: string = `${__dirname}/files`;

  async read(hash: string): Promise<Buffer> {
    return await readFile(`${this.directory}/${hash}`);
  }

  async write(data: Buffer): Promise<string> {
    await this.createDirectoryIfNotExists();
    const file_name = this.generateHashFromFileData(data);
    await writeFile(`${this.directory}/${file_name}`, data);
    return file_name;
  }

  async unlink(hash: string): Promise<void> {
    await unlink(`${this.directory}/${hash}`);
  }

  private generateHashFromFileData(data: Buffer): string {
    const md5_hash_generator = createHash("md5");
    return md5_hash_generator.update(data).digest("hex");
  }

  private async createDirectoryIfNotExists(): Promise<void> {
    try {
      await access(this.directory, constants.W_OK);
    } catch (error) {
      await this.createDirectory();
    }
  }

  private async createDirectory(): Promise<void> {
    await mkdir(this.directory, {
      mode: 0o775,
    });
  }
}
