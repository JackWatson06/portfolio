import { useActionState } from "react";

import Login from "@/app/login/page";
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("@/app/login/SessionCommand", () => {
  return {
    createSession: async (prev_state: any, form_data: FormData) => {},
  };
});

jest.mock("react", () => {
  return {
    ...jest.requireActual("react"),
    useActionState: jest.fn(),
  };
});

beforeEach(() => {
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    "testing",
  ]);
});

test("login page renders valid HTML.", async () => {
  const { container } = render(<Login />);

  expect(container.innerHTML).toHTMLValidate();
});

test("accessability of page.", async () => {
  const { container } = render(<Login />);

  await act(async () => {
    expect(await axe(container)).toHaveNoViolations();
  });
});

test("login form does not render warnings when we have no errors.", () => {
  const { queryByRole } = render(<Login />);

  expect(queryByRole("alert")).toBe(null);
});

test("login form does renders warning when we have an error.", () => {
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: ["testing"] },
    "testing",
  ]);

  const { queryByText } = render(<Login />);

  expect(queryByText("testing")).not.toBe(null);
});

test("login form does renders warnings when we have multiple errors.", () => {
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: ["testing", "testing"] },
    "testing",
  ]);

  const { queryByText } = render(<Login />);

  expect(queryByText("testing, testing")).not.toBe(null);
});
