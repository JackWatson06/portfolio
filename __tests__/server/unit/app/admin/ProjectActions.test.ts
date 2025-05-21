import {
  TEST_PROJECT_ONE,
  TEST_PROJECT_ONE_CREATE_INPUT,
} from "@/__tests__/seeding/projects/ProjectData";
import { TEST_PROJECT_ONE_PERSISTED } from "@/__tests__/seeding/projects/ProjectInDBData";
import {
  fetchBlobUploadParameters,
  fetchProjectWithName,
  projectCreateAction,
  projectUpdateAction,
} from "@/app/admin/projects/actions";
import { ServiceResult } from "@/projects/ProjectServiceResult";
import { init } from "@/services/setup";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ value: "testing" }),
  }),
}));
jest.mock("@/services/setup");

/* --------------------------- projectCreateAction -------------------------- */
test("authenticating user when creating a new project", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce({
    value: "testing_invalid",
  });

  const result = await projectCreateAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("authenticating user with missing token while creating a new project", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce(undefined);

  const result = await projectCreateAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("uploading a project", async () => {
  ((await init()).project.create as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.SUCCESS,
  });

  const result = await projectCreateAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("SUCCESS");
});

test("reporting error on invalid project upload", async () => {
  ((await init()).project.create as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.INVALID,
    message: "Invalid project upload.",
  });

  const result = await projectCreateAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("reporting error on duplicate project upload", async () => {
  ((await init()).project.create as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.DUPLICATE,
  });

  const result = await projectCreateAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

test("reporting error on exception while creating", async () => {
  ((await init()).project.create as jest.Mock).mockImplementationOnce(() => {
    throw Error("Database had an error.");
  });

  const result = await projectCreateAction(TEST_PROJECT_ONE_CREATE_INPUT);

  expect(result.code).toBe("ERROR");
});

/* ------------------------ fetchBlobUploadParameters ----------------------- */
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

/* -------------------------- fetchProjectWithName -------------------------- */
test("authenticating user while fetching project with name", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce({
    value: "testing_invalid",
  });

  const result = await fetchProjectWithName("testing");

  expect(result).toBe(null);
});

test("authenticating user with missing token while fetching project with name", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce(undefined);

  const result = await fetchProjectWithName("testing");

  expect(result).toBe(null);
});

test("fetching upload returns null when project not found", async () => {
  ((await init()).project.findByName as jest.Mock).mockReturnValue(null);

  const result = await fetchProjectWithName("testing");

  expect(result).toBeNull();
});

test("fetching excludes id on return", async () => {
  ((await init()).project.findByName as jest.Mock).mockReturnValue(
    TEST_PROJECT_ONE_PERSISTED,
  );

  const result = await fetchProjectWithName("testing");

  expect(result).toEqual(TEST_PROJECT_ONE);
});

/* --------------------------- projectUpdateAction -------------------------- */
test("authenticating user when updating a new project", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce({
    value: "testing_invalid",
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});

test("authenticating user with missing token while updating a new project", async () => {
  ((await cookies()).get as jest.Mock).mockReturnValueOnce(undefined);

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});

test("updating a project", async () => {
  ((await init()).project.update as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.SUCCESS,
    slug: "testing",
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("SUCCESS");
});

test("reporting error on not found project update", async () => {
  ((await init()).project.update as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.NOT_FOUND,
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});

test("reporting error on duplicate project update", async () => {
  ((await init()).project.update as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.DUPLICATE,
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});

test("reporting error on could not remove blob while updating project", async () => {
  ((await init()).project.update as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.COULD_NOT_REMOVE,
    message: "testing",
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});

test("reporting error on invalid project update", async () => {
  ((await init()).project.update as jest.Mock).mockReturnValueOnce({
    code: ServiceResult.INVALID,
    message: "testing",
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});

test("reporting error on exception while updating", async () => {
  ((await init()).project.update as jest.Mock).mockImplementationOnce(() => {
    throw Error("Database had an error.");
  });

  const result = await projectUpdateAction("testing", {});

  expect(result.code).toBe("ERROR");
});
