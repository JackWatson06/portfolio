import { test } from "@jest/globals";
import { access, chmod, constants, mkdir, rm, writeFile } from "fs/promises";
import { normalize } from "path";
import { LocalFileSystem } from "@/services/file-system/LocalFileSystem";

const local_file_system = new LocalFileSystem();
const FILE_SYSTEM_MODULE_PATH = normalize(
  `${__dirname}/../../../../services/file-system`,
);
const LOCAL_FILE_STORAGE_PATH = `${FILE_SYSTEM_MODULE_PATH}/files`;

afterEach(async () => {
  await rm(LOCAL_FILE_STORAGE_PATH, { recursive: true, force: true });
});

test("We write a file to the disk.", async () => {
  const data = new Uint16Array([5, 5, 5, 5]);
  const test_file = Buffer.from(data);

  const hash = await local_file_system.write(test_file);

  const local_file_name = `${LOCAL_FILE_STORAGE_PATH}/${hash}`;
  expect(await access(local_file_name, constants.F_OK)).toBe(undefined);
});

test("We can not create files directory without permissions.", async () => {
  const data = new Uint16Array([5, 5, 5, 5]);
  const test_file = Buffer.from(data);
  await chmod(FILE_SYSTEM_MODULE_PATH, 0o555);

  await expect(local_file_system.write(test_file)).rejects.toThrow();

  await chmod(FILE_SYSTEM_MODULE_PATH, 0o775);
});

test("We can not write a file without valid file permissions.", async () => {
  const data = new Uint16Array([5, 5, 5, 5]);
  const test_file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o555,
  });

  await expect(local_file_system.write(test_file)).rejects.toThrow();

  await chmod(LOCAL_FILE_STORAGE_PATH, 0o775);
});

test("Test two different files do not have the same name.", async () => {
  const data_one = new Uint16Array([5, 5, 5, 5]);
  const data_two = new Uint16Array([4, 4, 4, 4]);
  const test_file_one = Buffer.from(data_one);
  const test_file_two = Buffer.from(data_two);

  const hash_one = await local_file_system.write(test_file_one);
  const hash_two = await local_file_system.write(test_file_two);
  expect(hash_one).not.toBe(hash_two);
});

test("Test two similar files have the same name.", async () => {
  const data_one = new Uint16Array([5, 5, 5, 5]);
  const data_two = new Uint16Array([5, 5, 5, 5]);
  const test_file_one = Buffer.from(data_one);
  const test_file_two = Buffer.from(data_two);

  const hash_one = await local_file_system.write(test_file_one);
  const hash_two = await local_file_system.write(test_file_two);
  expect(hash_one).toBe(hash_two);
});

test("We can read file from the disk.", async () => {
  const data = new Uint16Array([5, 5, 5, 5]);
  const file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o775,
  });

  await writeFile(`${LOCAL_FILE_STORAGE_PATH}/testing`, file);

  expect(await local_file_system.read("testing")).toEqual(file);
});

test("We get an error reading a non-existant file.", async () => {
  const data = new Uint16Array([5, 5, 5, 5]);
  const file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o775,
  });

  await expect(local_file_system.read("testing")).rejects.toThrow();
});

test("We can remove a file.", async () => {
  const data = new Uint16Array([5, 5, 5, 5]);
  const file = Buffer.from(data);
  await mkdir(LOCAL_FILE_STORAGE_PATH, {
    mode: 0o775,
  });
  const file_path = `${LOCAL_FILE_STORAGE_PATH}/testing`;

  await writeFile(file_path, file);

  await local_file_system.unlink("testing");

  await expect(access(file_path)).rejects.toThrow();
});
