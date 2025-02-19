import { fetchBlobUploadParameters } from "@/app/admin/projects/create/queries";
import { init } from "@/services/setup";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ value: "testing" }),
  }),
}));
jest.mock("@/services/setup");

test("authenticating user while fetching upload parameters", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce({
    value: "testing_invalid",
  });

  const result = await fetchBlobUploadParameters("testing");

  expect(result).toBe(null);
});

test("authenticating user with missing token while fetching upload parameters", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce(undefined);

  const result = await fetchBlobUploadParameters("testing");

  expect(result).toBe(null);
});

test("fetching upload parameters returns params", async () => {
  const test_upload_params = {
    upload: {
      url: "https://testing.com",
      method: "POST",
      headers: {},
    },
    public_url: "https://testing.com",
  };
  ((await init()).media_upload.findUploadParams as jest.Mock).mockReturnValue(
    test_upload_params,
  );

  const result = await fetchBlobUploadParameters("testing");

  expect(result).toBe(test_upload_params);
});
