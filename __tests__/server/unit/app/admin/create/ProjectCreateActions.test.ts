import { TEST_PROJECT_ONE_CREATE_INPUT } from "@/__tests__/seeding/projects/ProjectData";
import { projectUploadAction } from "@/app/admin/projects/create/actions";
import { ServiceResult } from "@/projects/ProjectServiceResult";
import { init } from "@/services/setup";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ value: "testing" }),
  }),
}));
jest.mock("@/services/setup");

test("authenticating user when creating a new project", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce({
    value: "testing_invalid",
  });

  const result = await projectUploadAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("authenticating user with missing token while creating a new project", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce(undefined);

  const result = await projectUploadAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("uploading a project", async () => {
  ((await init()).project.create as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.SUCCESS,
  });

  const result = await projectUploadAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("SUCCESS");
});

test("reporting error on invalid project upload", async () => {
  ((await init()).project.create as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.INVALID,
    message: "Invalid project upload.",
  });

  const result = await projectUploadAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("reporting error on duplicate project upload", async () => {
  ((await init()).project.create as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.DUPLICATE,
  });

  const result = await projectUploadAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("reporting error on exception", async () => {
  ((await init()).project.create as jest.Mock).mockImplementationOnce(() => {
    throw Error("Database had an error.");
  });

  const result = await projectUploadAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});
