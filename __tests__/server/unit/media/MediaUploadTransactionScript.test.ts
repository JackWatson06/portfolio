import { MediaUploadTransactionScript } from "@/media/upload/MediaUploadTransactionScript";
import { BlobStorage, UploadHTTPParams } from "@/services/fs/BlobStorage";

class TestBlobStorageService implements BlobStorage {
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

  removeBlob(file_name: string) {}
}

class TestInvalidBlobStorageService implements BlobStorage {
  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    throw new Error("Error with blob storage.");
  }

  removeBlob(file_name: string) {}
}

test("fetching the request parameters to upload a file", async () => {
  const media_upload_transaction_service = new MediaUploadTransactionScript(
    new TestBlobStorageService(),
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
    new TestInvalidBlobStorageService(),
  );

  const media_upload_params =
    await media_upload_transaction_service.findUploadParams("testing");

  expect(media_upload_params).toBe(null);
});
