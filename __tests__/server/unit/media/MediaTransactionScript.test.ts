import { FileSystem } from "@/services/fs/FileSystem";
import { CollectionGateway } from "@/media/CollectionGateway";
import { Media } from "@/services/db/schemas/Media";
import { ObjectId, WithId } from "mongodb";
import { ServiceResult } from "@/media/MediaServiceResult";
import { MediaTransactionScript } from "@/media/MediaTransactionScript";

const MEDIA_CREATE_INPUT_ONE = {
  file_name: "testing.png",
  content_type: "image/png",
  size: 1_000,
  data: Buffer.from([1, 2, 3]),
};

const MEDIA_ONE_PERSISTED: WithId<Media> = {
  _id: new ObjectId(),
  hash: "testing_hash",
  file_name: "testing.png",
  content_type: "image/png",
  size: 1_000,
  uploaded_at: new Date("2024-02-021T01:00Z"),
};

class TestFileSystem implements FileSystem {
  public last_buffer_write: Buffer | null = null;
  public last_removed_hash: string | null = null;

  constructor(private read_result: Buffer | null = Buffer.from([1, 2, 3])) {}

  async read(hash: string): Promise<Buffer> {
    if (this.read_result == null) {
      throw new Error("Error");
    }
    return this.read_result;
  }
  async write(data: Buffer): Promise<string> {
    this.last_buffer_write = data;
    return "testing_hash";
  }
  async unlink(hash: string): Promise<void> {
    this.last_removed_hash = hash;
  }
}

class TestCollecitonGateway implements CollectionGateway {
  public last_created_media: Media | null = null;
  public last_removed_file_name: string | null = null;

  constructor(
    private find_result: WithId<Media> | null = MEDIA_ONE_PERSISTED,
  ) {}

  async insert(media: Media): Promise<void> {
    this.last_created_media = media;
  }
  async find(file_name: string): Promise<WithId<Media> | null> {
    return this.find_result;
  }
  async delete(file_name: string): Promise<void> {
    this.last_removed_file_name = file_name;
  }
}

class TestInvalidFileSystem implements FileSystem {
  read(hash: string): Promise<Buffer> {
    throw new Error("Error");
  }
  write(data: Buffer): Promise<string> {
    throw new Error("Error");
  }
  unlink(hash: string): Promise<void> {
    throw new Error("Error");
  }
}

test("uplaoding a media file", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    new TestCollecitonGateway(),
  );

  const result = await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(result.code).toBe(ServiceResult.SUCCESS);
});

test("uplaoding a media file creates a new file", async () => {
  const test_file_system = new TestFileSystem();
  const media_transaction_script = new MediaTransactionScript(
    test_file_system,
    new TestCollecitonGateway(),
  );

  await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(test_file_system.last_buffer_write).toBe(MEDIA_CREATE_INPUT_ONE.data);
});

test("uploading file creates a new database record", async () => {
  const test_collection_gateway = new TestCollecitonGateway();
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    test_collection_gateway,
  );

  await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(test_collection_gateway.last_created_media?.hash).toBe("testing_hash");
});

test("service error on invalid write", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestInvalidFileSystem(),
    new TestCollecitonGateway(),
  );

  const result = await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(result.code).toBe(ServiceResult.SERVICE_ERROR);
});

test("fetching a media element", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    new TestCollecitonGateway(),
  );

  const media = await media_transaction_script.read("testing");

  expect(media).not.toBe(null);
});

test("returning null when media element not found on the file system", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(null),
    new TestCollecitonGateway(),
  );

  const media = await media_transaction_script.read("testing");

  expect(media).toBe(null);
});

test("returning null when media element not found in the database", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    new TestCollecitonGateway(null),
  );

  const media = await media_transaction_script.read("testing");

  expect(media).toBe(null);
});

test("deleting a file", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    new TestCollecitonGateway(),
  );

  const result = await media_transaction_script.delete("testing.png");

  expect(result.code).toBe(ServiceResult.SUCCESS);
});
test("deleting a file returns not found", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    new TestCollecitonGateway(null),
  );

  const result = await media_transaction_script.delete("testing.png");

  expect(result.code).toBe(ServiceResult.NOT_FOUND);
});

test("deleting a file removes the database record", async () => {
  const test_collection_gateway = new TestCollecitonGateway();
  const media_transaction_script = new MediaTransactionScript(
    new TestFileSystem(),
    test_collection_gateway,
  );

  await media_transaction_script.delete("testing.png");

  expect(test_collection_gateway.last_removed_file_name).toBe("testing.png");
});

test("deleting a file uses the hash", async () => {
  const test_file_system = new TestFileSystem();
  const media_transaction_script = new MediaTransactionScript(
    test_file_system,
    new TestCollecitonGateway(),
  );

  await media_transaction_script.delete("testing.png");

  expect(test_file_system.last_removed_hash).toBe("testing_hash");
});

test("deleting a file returns service error on invalid write", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new TestInvalidFileSystem(),
    new TestCollecitonGateway(),
  );

  const result = await media_transaction_script.delete("testing.png");

  expect(result.code).toBe(ServiceResult.SERVICE_ERROR);
});
