import { useActionState } from "react";

import Login from "@/app/login/page";
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("@/app/login/commands", () => {
  return {
    createSession: jest.fn(),
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
