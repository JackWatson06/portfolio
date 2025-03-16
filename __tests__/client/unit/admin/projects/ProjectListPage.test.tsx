import { TEST_ADMIN_PROJECT_LIST_VIEW } from "@/__tests__/seeding/projects/ProjectViewData";
import Projects from "@/app/admin/projects/page";
import "@testing-library/jest-dom";
import { act, render, within } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";
import { fetchProjectListView } from "@/app/admin/projects/queries";

expect.extend(toHaveNoViolations);

jest.mock("@/app/admin/projects/queries", () => ({
  fetchProjectListView: jest.fn(),
}));

beforeEach(() => {
  (fetchProjectListView as jest.Mock).mockImplementation(
    async () => TEST_ADMIN_PROJECT_LIST_VIEW,
  );
});

test("admin list page renders valid HTML.", async () => {
  const { container } = render(await Projects());

  expect(container.innerHTML).toHTMLValidate();
});

test("accessability of page.", async () => {
  const { container } = render(await Projects());

  await act(async () => {
    expect(await axe(container)).toHaveNoViolations();
  });
});

test("displaying all project titles.", async () => {
  const expected_project_regexes = [/gandalf/i, /bilbo/i, /aragorn/i];

  const { getByRole } = render(await Projects());

  const actual_elements = expected_project_regexes
    .map((search_regex) => {
      return getByRole("heading", {
        name: search_regex,
        level: 2,
      });
    })
    .filter((element) => element != null);
  expect(actual_elements.length).toBe(3);
});

test("displaying empty message when we have no projects.", async () => {
  (fetchProjectListView as jest.Mock).mockImplementation(async () => []);
  const { queryByText } = render(await Projects());

  expect(queryByText(/no projects/i)).toBeInTheDocument();
});
