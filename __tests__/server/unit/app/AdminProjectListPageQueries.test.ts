import { TEST_ADMIN_PROJECT_LIST_VIEW } from "@/app/admin/projects/__mocks__/queries";
import { fetchProjectListView } from "@/app/admin/projects/queries";

jest.mock("@/services/setup");

test("transforming data requested from the server.", async () => {
  const projects = await fetchProjectListView();

  expect(projects).toStrictEqual(TEST_ADMIN_PROJECT_LIST_VIEW);
});
