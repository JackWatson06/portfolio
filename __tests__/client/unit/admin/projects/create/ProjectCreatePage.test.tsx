import CreateProject from "@/app/admin/projects/create/page";
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("@/app/admin/projects/create/actions", () => ({
  handleProjectFormAction: jest.fn(),
}));
// How are we checking for required forms on the backend? I don't think we are doing any check
// for the required fields. I think that since we have a type contract between the frontend and
// the backend we can do a zod validation on the frontend client. This can be handled in the submit
// action

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
