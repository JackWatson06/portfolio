import Projects from "@/app/admin/projects/page";
import RootLayout from "@/app/layout";
import "@testing-library/jest-dom";
import { act, cleanup, render } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";
import { Suspense } from "react";

expect.extend(toHaveNoViolations);

jest.mock("@/app/admin/projects/queries");

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

  cleanup();
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
