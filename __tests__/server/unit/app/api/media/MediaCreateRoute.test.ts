import { POST } from "@/app/api/media/route";
import { MediaService } from "@/media/MediaService";
import { ServiceResult } from "@/media/MediaServiceResult";
import { init } from "@/services/setup";

jest.mock("@/services/setup");

const TEST_ENDPOINT = "https://testing.com/api/media";

let mocked_media_transaction_script: MediaService;
beforeEach(async () => {
  mocked_media_transaction_script = (await init()).media;
  (mocked_media_transaction_script.upload as jest.Mock).mockReturnValue({
    code: ServiceResult.SUCCESS,
  });
});

test("writing a file returns 200", async () => {
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Portfolio-File-Name": "testing.png",
      "Content-Type": "image/png",
      "Content-Length": "3",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(201);
});

test("writing a file returns 400 when missing file name", async () => {
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Content-Type": "image/png",
      "Content-Length": "3",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(400);
});

test("writing a file returns 400 when missing content type", async () => {
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Portfolio-File-Name": "testing.png",
      "Content-Length": "3",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(400);
});

test("writing a file returns 400 when missing content length", async () => {
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Portfolio-File-Name": "testing.png",
      "Content-Type": "image/png",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(400);
});

test("writing a file returns 400 with invalid content size", async () => {
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Portfolio-File-Name": "testing.png",
      "Content-Type": "image/png",
      "Content-Length": "testing",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(400);
});

test("writing a file returns 500 on service error", async () => {
  (mocked_media_transaction_script.upload as jest.Mock).mockReturnValue({
    code: ServiceResult.SERVICE_ERROR,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Portfolio-File-Name": "testing.png",
      "Content-Type": "image/png",
      "Content-Length": "3",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(500);
});

test("writing a file with init error returns 500", async () => {
  (init as jest.Mock).mockImplementation(() => {
    throw new Error("Testing");
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "POST",
    body: Buffer.from([0, 1, 2]),
    headers: {
      "Portfolio-File-Name": "testing.png",
      "Content-Type": "image/png",
      "Content-Length": "3",
    },
  });

  const response = await POST(request);

  expect(response.status).toBe(500);
});
