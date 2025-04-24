import { LocalBlobStorage } from "@/services/fs/LocalBlobStorage";
import { MockMediaService } from "@/media/__mocks__/MediaService";
import { BlobStorageResult, UploadHTTPParams } from "@/services/fs/BlobStorage";
import { ServiceResult } from "@/media/MediaServiceResult";

test("generating HTTP params for uploading", async () => {
  const local_blob_storage = new LocalBlobStorage(
    1000,
    "testing",
    new MockMediaService(),
  );

  const actual_result = await local_blob_storage.generateHTTPParams("testing");

  const expected_result: UploadHTTPParams = {
    upload: {
      url: `http://localhost:1000/api/media`,
      method: "POST",
      headers: {
        "Portfolio-File-Name": "testing",
      },
    },
    public_url: `testing/api/media/testing`,
  };
  expect(actual_result).toEqual(expected_result);
});

test("removing blob in local storage", async () => {
  const local_blob_storage = new LocalBlobStorage(
    1000,
    "testing",
    new MockMediaService(),
  );

  const result_code = await local_blob_storage.removeBlob("testing");

  expect(result_code).toEqual(BlobStorageResult.SUCCESS);
});

test("removing blob in local storage returns error", async () => {
  const mock_media_service = new MockMediaService();
  const local_blob_storage = new LocalBlobStorage(
    1000,
    "testing",
    mock_media_service,
  );
  mock_media_service.delete_return = {
    code: ServiceResult.SERVICE_ERROR,
  };

  const result_code = await local_blob_storage.removeBlob("testing");

  expect(result_code).toEqual(BlobStorageResult.ERROR);
});
