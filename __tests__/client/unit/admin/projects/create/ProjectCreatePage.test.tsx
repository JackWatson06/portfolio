import CreateProject from "@/app/admin/projects/create/page";
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("@/services/setup");
jest.mock("@/app/admin/projects/create/actions", () => ({
  handleProjectFormAction: jest.fn(),
}));

test("admin project create page renders valid HTML.", async () => {
  const { container } = render(await CreateProject());

  expect(container.innerHTML).toHTMLValidate();
});

test("accessability of page.", async () => {
  const { container } = render(await CreateProject());

  await act(async () => {
    expect(await axe(container)).toHaveNoViolations();
  });
});
