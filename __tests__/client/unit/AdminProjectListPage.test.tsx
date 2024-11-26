import AdminProjectList from "@/app/(admin)/admin/projects/page"
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import "html-validate/jest";

jest.mock("@/app/(admin)/admin/projects/queries", () => ({
  fetchAllProjects: jest.fn()
}))

test("admin project list page has valid HTML.", async () => {
  const { container } = render(await AdminProjectList());

  expect(container.innerHTML).toHTMLValidate();
});

test("login form does not render warnings when we have no errors.", () => {
  render(<Login />);

  expect(screen.queryByRole("alert")).toBe(null);
});
