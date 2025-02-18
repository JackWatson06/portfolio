import { GET, DELETE } from "@/app/api/media/[name]/route";
import { MediaRead } from "@/media/DTOSchema";
import { TransactionScript as MediaTransactionScript } from "@/media/TransactionScript";
import { ScriptResult } from "@/media/TransactionScriptResult";
import { init } from "@/services/setup";

jest.mock("@/services/setup");

const TEST_ENDPOINT = "https://testing.com/api/media";
const TEST_ROUTE_PARAM = {
  params: new Promise<{ file_name: string }>((resolve) =>
    resolve({ file_name: "testing" }),
  ),
};
const MEDIA_READ: MediaRead = {
  hash: "testing_hash",
  file_name: "testing.png",
  content_type: "image/png",
  size: 1_000,
  uploaded_at: new Date("2024-02-021T01:00Z"),
  data: Buffer.from([1, 2, 3]),
};

let mocked_media_transaction_script: MediaTransactionScript;
beforeEach(async () => {
  mocked_media_transaction_script = (await init()).media;
  (mocked_media_transaction_script.delete as jest.Mock).mockReturnValue({
    code: ScriptResult.SUCCESS,
  });
});

/* -------------------------------------------------------------------------- */
/*                                  Get Route                                 */
/* -------------------------------------------------------------------------- */
test("reading a file returns 200", async () => {
  (mocked_media_transaction_script.read as jest.Mock).mockReturnValue({
    ...MEDIA_READ,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "GET",
  });

  const response = await GET(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(200);
});
test("reading a file returns correct body", async () => {
  (mocked_media_transaction_script.read as jest.Mock).mockReturnValue({
    ...MEDIA_READ,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "GET",
  });
  7;
  const response = await GET(request, TEST_ROUTE_PARAM);

  expect(Buffer.from(await response.bytes())).toEqual(Buffer.from([1, 2, 3]));
});

test("reading a file returns correct headers", async () => {
  (mocked_media_transaction_script.read as jest.Mock).mockReturnValue({
    ...MEDIA_READ,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "GET",
  });

  const response = await GET(request, TEST_ROUTE_PARAM);

  const expected_headers = new Headers({
    "Content-Disposition": "inline",
    "Content-Length": "1000",
    "Content-Type": "image/png",
    "Content-Language": "en-US",
  });
  expect(response.headers).toEqual(expected_headers);
});

test("reading a file returns 404 on file not found", async () => {
  (mocked_media_transaction_script.read as jest.Mock).mockReturnValue(null);
  const request = new Request(TEST_ENDPOINT, {
    method: "GET",
  });

  const response = await GET(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(404);
});

test("reading a file returns 500 on service error", async () => {
  (mocked_media_transaction_script.read as jest.Mock).mockImplementationOnce(
    () => {
      throw new Error("Invalid file read.");
    },
  );
  const request = new Request(TEST_ENDPOINT, {
    method: "GET",
  });

  const response = await GET(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(500);
});

test("reading a file with init error returns 500", async () => {
  (init as jest.Mock).mockImplementationOnce(() => {
    throw new Error("Testing");
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "GET",
  });

  const response = await GET(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(500);
});

/* -------------------------------------------------------------------------- */
/*                                Delete Route                                */
/* -------------------------------------------------------------------------- */
test("deleting a file returns 200", async () => {
  (mocked_media_transaction_script.delete as jest.Mock).mockReturnValue({
    code: ScriptResult.SUCCESS,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "DELETE",
  });

  const response = await DELETE(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(200);
});

test("deleting a file returns 404", async () => {
  (mocked_media_transaction_script.delete as jest.Mock).mockReturnValue({
    code: ScriptResult.NOT_FOUND,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "DELETE",
  });

  const response = await DELETE(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(404);
});

test("deleting a file returns 500 on init error", async () => {
  (init as jest.Mock).mockImplementationOnce(() => {
    throw new Error("Testing");
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "DELETE",
  });

  const response = await DELETE(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(500);
});

test("deleting a file returns 500 on service error", async () => {
  (mocked_media_transaction_script.delete as jest.Mock).mockReturnValue({
    code: ScriptResult.SERVICE_ERROR,
  });
  const request = new Request(TEST_ENDPOINT, {
    method: "DELETE",
  });

  const response = await DELETE(request, TEST_ROUTE_PARAM);

  expect(response.status).toBe(500);
});
