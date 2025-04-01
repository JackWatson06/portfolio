import { render, screen } from "@testing-library/react";
import FormAlert from "@/components/FormAlert";
import "@testing-library/jest-dom";

test("form alert does not render warnings when we have no errors.", () => {
  render(<FormAlert errors={[]} />);

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("form alert renders warning when we have an error.", () => {
  render(<FormAlert errors={["testing"]} />);

  expect(screen.queryByText("testing")).toBeInTheDocument();
});

test("form alert renders warnings when we have multiple errors.", () => {
  render(<FormAlert errors={["testing", "testing"]} />);

  expect(screen.queryByText("testing, testing")).toBeInTheDocument();
});
