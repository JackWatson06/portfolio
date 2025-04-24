import { TEST_ADMIN_PROJECT_LIST_VIEW } from "@/__tests__/seeding/projects/ProjectViewData";
import { fetchProjectListView } from "@/app/admin/projects/queries";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ value: "testing" }),
  }),
}));
jest.mock("@/services/setup");

test("transforming data requested from the server.", async () => {
  const projects = await fetchProjectListView();

  expect(projects).toStrictEqual(TEST_ADMIN_PROJECT_LIST_VIEW);
});
