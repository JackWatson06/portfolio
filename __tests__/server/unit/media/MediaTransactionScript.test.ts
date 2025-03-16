import { FileSystem } from "@/services/fs/FileSystem";
import { CollectionGateway } from "@/media/CollectionGateway";
import { Media } from "@/services/db/schemas/Media";
import { ObjectId, WithId } from "mongodb";
import { ServiceResult } from "@/media/MediaServiceResult";
import { MediaTransactionScript } from "@/media/MediaTransactionScript";
import { MockMediaScriptInstrumentation } from "@/media/__mocks__/MediaScriptInstrumentation";

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

jest.mock("@/services/fs/LocalFileSystem");

class MockFileSystem implements FileSystem {
  public last_buffer_write: Buffer | null = null;
  public last_removed_hash: string | null = null;

  constructor(private read_result: Buffer | null = Buffer.from([1, 2, 3])) {}

  async read(hash: string): Promise<Buffer> {
    if (this.read_result == null) {
      throw new Error("test_error");
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

class MockCollectionGateway implements CollectionGateway {
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

class StubInvalidFileSystem implements FileSystem {
  read(hash: string): Promise<Buffer> {
    throw new Error("test_error");
  }
  write(data: Buffer): Promise<string> {
    throw new Error("test_error");
  }
  unlink(hash: string): Promise<void> {
    throw new Error("test_error");
  }
}

test("uplaoding a media file", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  const result = await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(result.code).toBe(ServiceResult.SUCCESS);
});

test("uplaoding a media file creates a new file", async () => {
  const test_file_system = new MockFileSystem();
  const media_transaction_script = new MediaTransactionScript(
    test_file_system,
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(test_file_system.last_buffer_write).toBe(MEDIA_CREATE_INPUT_ONE.data);
});

test("uploading file creates a new database record", async () => {
  const test_collection_gateway = new MockCollectionGateway();
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    test_collection_gateway,
    new MockMediaScriptInstrumentation(),
  );

  await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(test_collection_gateway.last_created_media?.hash).toBe("testing_hash");
});

test("service error on invalid write", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new StubInvalidFileSystem(),
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  const result = await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(result.code).toBe(ServiceResult.SERVICE_ERROR);
});

test("recording error on write", async () => {
  const mock_media_script_instrumentation =
    new MockMediaScriptInstrumentation();
  const media_transaction_script = new MediaTransactionScript(
    new StubInvalidFileSystem(),
    new MockCollectionGateway(),
    mock_media_script_instrumentation,
  );

  await media_transaction_script.upload(MEDIA_CREATE_INPUT_ONE);

  expect(mock_media_script_instrumentation.upload_failed).toBe(
    "Error: test_error",
  );
});

test("fetching a media element", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  const media = await media_transaction_script.read("testing");

  expect(media).not.toBe(null);
});

test("returning null when media element not found in the database", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(null),
    new MockMediaScriptInstrumentation(),
  );

  const media = await media_transaction_script.read("testing");

  expect(media).toBe(null);
});

test("recording missing file fetch with database miss", async () => {
  const mock_media_script_instrumentation =
    new MockMediaScriptInstrumentation();
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(null),
    mock_media_script_instrumentation,
  );

  await media_transaction_script.read("testing");

  expect(mock_media_script_instrumentation.missing_file_for_fetch).toBe(
    "testing",
  );
});

test("returning null when media element not found on the file system", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(null),
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  const media = await media_transaction_script.read("testing");

  expect(media).toBe(null);
});

test("recording error for file fetch with file system error", async () => {
  const mock_media_script_instrumentation =
    new MockMediaScriptInstrumentation();
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(null),
    new MockCollectionGateway(),
    mock_media_script_instrumentation,
  );

  await media_transaction_script.read("testing");

  expect(mock_media_script_instrumentation.fetch_failed).toEqual([
    "testing",
    "Error: test_error",
  ]);
});

test("deleting a file", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  const result = await media_transaction_script.delete("testing.png");

  expect(result.code).toBe(ServiceResult.SUCCESS);
});

test("deleting a file returns not found", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(null),
    new MockMediaScriptInstrumentation(),
  );

  const result = await media_transaction_script.delete("testing.png");

  expect(result.code).toBe(ServiceResult.NOT_FOUND);
});

test("recording missing file for delete with database miss", async () => {
  const mock_media_script_instrumentation =
    new MockMediaScriptInstrumentation();
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    new MockCollectionGateway(null),
    mock_media_script_instrumentation,
  );

  await media_transaction_script.delete("testing.png");

  expect(mock_media_script_instrumentation.missing_file_for_delete).toBe(
    "testing.png",
  );
});

test("deleting a file removes the database record", async () => {
  const test_collection_gateway = new MockCollectionGateway();
  const media_transaction_script = new MediaTransactionScript(
    new MockFileSystem(),
    test_collection_gateway,
    new MockMediaScriptInstrumentation(),
  );

  await media_transaction_script.delete("testing.png");

  expect(test_collection_gateway.last_removed_file_name).toBe("testing.png");
});

test("deleting a file uses the hash", async () => {
  const test_file_system = new MockFileSystem();
  const media_transaction_script = new MediaTransactionScript(
    test_file_system,
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  await media_transaction_script.delete("testing.png");

  expect(test_file_system.last_removed_hash).toBe("testing_hash");
});

test("deleting a file returns service error on invalid write", async () => {
  const media_transaction_script = new MediaTransactionScript(
    new StubInvalidFileSystem(),
    new MockCollectionGateway(),
    new MockMediaScriptInstrumentation(),
  );

  const result = await media_transaction_script.delete("testing.png");

  expect(result.code).toBe(ServiceResult.SERVICE_ERROR);
});

test("recording delete failed", async () => {
  const mock_media_script_instrumentation =
    new MockMediaScriptInstrumentation();
  const media_transaction_script = new MediaTransactionScript(
    new StubInvalidFileSystem(),
    new MockCollectionGateway(),
    mock_media_script_instrumentation,
  );

  await media_transaction_script.delete("testing.png");

  expect(mock_media_script_instrumentation.delete_failed).toEqual([
    "testing.png",
    "Error: test_error",
  ]);
});
