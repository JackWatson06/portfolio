import { test } from "@jest/globals";
import { access, chmod, constants, mkdir, rm, writeFile } from "fs/promises";
import { normalize } from "path";
import { LocalFileSystem } from "@/services/fs/LocalFileSystem";
import { FileHashingAlgorithm } from "@/services/fs/FileHashingAlgorithm";

class TestFileHashingAlgorithm implements FileHashingAlgorithm {
  hash(buffer: Buffer): string {
    return "testing";
  }
}

const local_file_system = new LocalFileSystem(new TestFileHashingAlgorithm());
const FILE_SYSTEM_MODULE_PATH = normalize(
  `${__dirname}/../../../../../services/fs`,
);
const LOCAL_FILE_STORAGE_PATH = `${FILE_SYSTEM_MODULE_PATH}/files`;

afterEach(async () => {
  await rm(LOCAL_FILE_STORAGE_PATH, { recursive: true, force: true });
});

test("writing file to the disk", async () => {
  const data = new Uint8Array([5, 5, 5, 5]);
  const test_file = Buffer.from(data);

  const hash = await local_file_system.write(test_file);

  const local_file_name = `${LOCAL_FILE_STORAGE_PATH}/${hash}`;
  expect(await access(local_file_name, constants.F_OK)).toBe(undefined);
});

test("can not create files without valid module permissions", async () => {
  const data = new Uint8Array([5, 5, 5, 5]);
  const test_file = Buffer.from(data);
  await chmod(FILE_SYSTEM_MODULE_PATH, 0o555);

  await expect(local_file_system.write(test_file)).rejects.toThrow();

  await chmod(FILE_SYSTEM_MODULE_PATH, 0o775);
});

test("can not write a file without valid file permissions in folder", async () => {
  const data = new Uint8Array([5, 5, 5, 5]);
  const test_file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o555,
  });

  await expect(local_file_system.write(test_file)).rejects.toThrow();

  await chmod(LOCAL_FILE_STORAGE_PATH, 0o775);
});

test("returning the hash of the file", async () => {
  const data_one = new Uint8Array([5, 5, 5, 5]);
  const test_file_two = Buffer.from(data_one);

  const hash = await local_file_system.write(test_file_two);
  expect(hash).toBe("testing");
});

test("reading file from disk", async () => {
  const data = new Uint8Array([5, 5, 5, 5]);
  const file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o775,
  });

  await writeFile(`${LOCAL_FILE_STORAGE_PATH}/testing`, file);

  expect(await local_file_system.read("testing")).toEqual(file);
});

test("error while reading a non-existant file", async () => {
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o775,
  });

  await expect(local_file_system.read("testing")).rejects.toThrow();
});

test("removing a file", async () => {
  const data = new Uint8Array([5, 5, 5, 5]);
  const file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o775,
  });
  const file_path = `${LOCAL_FILE_STORAGE_PATH}/testing`;
  await writeFile(file_path, file);

  await local_file_system.unlink("testing");

  await expect(access(file_path)).rejects.toThrow();
});
