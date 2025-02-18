import { POST } from "@/app/api/media/route";
import { TransactionScript as MediaTransactionScript } from "@/media/TransactionScript";
import { ScriptResult } from "@/media/TransactionScriptResult";
import { Media } from "@/services/db/schemas/Media";
import { init } from "@/services/setup";
import { ObjectId, WithId } from "mongodb";

jest.mock("@/services/setup");

const TEST_ENDPOINT = "https://testing.com/api/media";
const MEDIA_ONE_PERSISTED: WithId<Media> = {
  _id: new ObjectId(),
  hash: "testing_hash",
  file_name: "testing.png",
  content_type: "image/png",
  size: 1_000,
  uploaded_at: new Date("2024-02-021T01:00Z"),
};

let mocked_media_transaction_script: MediaTransactionScript;
beforeEach(async () => {
  mocked_media_transaction_script = (await init()).media;
  (mocked_media_transaction_script.upload as jest.Mock).mockReturnValue({
    code: ScriptResult.SUCCESS,
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
    code: ScriptResult.SERVICE_ERROR,
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
