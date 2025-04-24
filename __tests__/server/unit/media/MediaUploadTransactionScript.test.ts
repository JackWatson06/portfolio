import { MediaUploadTransactionScript } from "@/media/upload/MediaUploadTransactionScript";
import {
  BlobStorage,
  BlobStorageResult,
  UploadHTTPParams,
} from "@/services/fs/BlobStorage";

class StubBlobStorageService implements BlobStorage {
  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    return {
      upload: {
        url: "https://testing.com",
        method: "POST",
        headers: {},
      },
      public_url: "https://testing.com",
    };
  }

  async removeBlob(file_name: string): Promise<BlobStorageResult> {
    return BlobStorageResult.SUCCESS;
  }
}

class StubInvalidBlobStorageService implements BlobStorage {
  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    throw new Error("Error with blob storage.");
  }

  async removeBlob(file_name: string): Promise<BlobStorageResult> {
    return BlobStorageResult.ERROR;
  }
}

test("fetching the request parameters to upload a file", async () => {
  const media_upload_transaction_service = new MediaUploadTransactionScript(
    new StubBlobStorageService(),
  );

  const media_upload_params =
    await media_upload_transaction_service.findUploadParams("testing");

  expect(media_upload_params).toEqual({
    upload: {
      url: "https://testing.com",
      method: "POST",
      headers: {},
    },
    public_url: "https://testing.com",
  });
});

test("fetching the request parameters returns null on error", async () => {
  const media_upload_transaction_service = new MediaUploadTransactionScript(
    new StubInvalidBlobStorageService(),
  );

  const media_upload_params =
    await media_upload_transaction_service.findUploadParams("testing");

  expect(media_upload_params).toBe(null);
});
