import { useFormState } from "react-dom";

import Login from "@/app/login/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import "html-validate/jest";

jest.mock("@/app/login/SessionCommand", () => {
  return {
    createSession: async (prev_state: any, form_data: FormData) => {},
  };
});

jest.mock("react-dom", () => {
  return {
    ...jest.requireActual("react-dom"),
    useFormState: jest.fn(),
  };
});

beforeEach(() => {
  (useFormState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    "testing",
  ]);
});

test("login page has valid HTML.", async () => {
  const { container } = render(<Login />);

  expect(container.innerHTML).toHTMLValidate();
});

test("login form does not render warnings when we have no errors.", () => {
  render(<Login />);

  expect(screen.queryByRole("alert")).toBe(null);
});

test("login form does renders warning when we have an error.", () => {
  (useFormState as jest.Mock).mockImplementation(() => [
    { errors: ["testing"] },
    "testing",
  ]);

  render(<Login />);

  expect(screen.queryByText("testing")).not.toBe(null);
});

test("login form does renders warnings when we have multiple errors.", () => {
  (useFormState as jest.Mock).mockImplementation(() => [
    { errors: ["testing", "testing"] },
    "testing",
  ]);

  render(<Login />);

  expect(screen.queryByText("testing, testing")).not.toBe(null);
});
