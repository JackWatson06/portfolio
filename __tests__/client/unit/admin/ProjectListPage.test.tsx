
import Projects from "@/app/admin/projects/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import "html-validate/jest";
import { fetchProjectListView } from "@/app/admin/projects/queries"
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations)

jest.mock("@/app/admin/projects/queries")

test("we render valid HTML for the admin list page.", async () => {
  const { container } = render(await Projects());

  expect(container.innerHTML).toHTMLValidate();
})

test("we pass accessability test.", async () => {
  const { container } = render(
    await Projects()
  );

  expect(await axe(container.innerHTML)).toHaveNoViolations();
});

test("we render all project titles.", async () => {
  const expected_project_regexes = [/project one/i, /project two/i, /project three/i]
  
  render(await Projects());
  
  const actual_elements = expected_project_regexes.map((search_regex) => {
    return screen.queryByText(search_regex)
  }).filter((element) => element != null);
  expect(actual_elements.length).toBe(3);
});

test("we render private indicators.", async () => {
  const expected_project_regexes = [/project one/i, /project two/i, /project three/i]
  
  render(await Projects());
  
  const actual_elements = expected_project_regexes.map((search_regex) => {
    return screen.queryByText(search_regex)
  })
  expect(actual_elements.length).toBe(3);
})

test("we render private indicators.", async () => {
  const expected_project_regexes = [/project one/i, /project two/i, /project three/i]
  
  render(await Projects());
  
  const actual_elements = screen.queryByRole("img", {
    name: /private/i
  }).filter((element) => element != null);
  expect(actual_elements.length).toBe(3);
})

test("we pull projects from a backend.", async () => {
  render(await Projects());

  expect(fetchProjectListView).toHaveBeenCalled();
})
