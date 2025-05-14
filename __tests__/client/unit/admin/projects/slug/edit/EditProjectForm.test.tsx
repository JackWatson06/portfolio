import { TEST_PROJECT_EDIT_FORM_STATE } from "@/__tests__/seeding/projects/ProjectViewData";
import EditProjectForm from "@/app/admin/projects/[slug]/edit/EditProjectForm";
import { useProjectEditFormActionState } from "@/app/admin/projects//hooks";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";

/* -------------------------------------------------------------------------- */
/*                                    Mocks                                   */
/* -------------------------------------------------------------------------- */
const mock_push: jest.Mock = jest.fn();
jest.mock("@/app/admin/projects/hooks", () => ({
  useProjectEditFormActionState: jest.fn(() => [
    { ...TEST_PROJECT_EDIT_FORM_STATE },
    jest.fn(),
  ]),
}));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(() => ({
    push: mock_push,
  })),
}));

/* -------------------------------------------------------------------------- */
/*                                    Setup                                   */
/* -------------------------------------------------------------------------- */
beforeEach(() => {
  mock_push.mockReset();
});

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */
test("admin project create form renders valid HTML", async () => {
  const { container } = render(
    <EditProjectForm form_state={TEST_PROJECT_EDIT_FORM_STATE} />,
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("submitting a valid form", async () => {
  // Arrange
  const submit_form_mock = jest.fn();
  (useProjectEditFormActionState as jest.Mock).mockImplementationOnce(() => [
    { ...TEST_PROJECT_EDIT_FORM_STATE },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  // Act
  render(<EditProjectForm form_state={TEST_PROJECT_EDIT_FORM_STATE} />);

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  // Assert
  expect(submit_form_mock).toHaveBeenCalled();
});

test("displaying loading when pending upload", () => {
  const submit_form_mock = jest.fn();
  (useProjectEditFormActionState as jest.Mock).mockReturnValueOnce([
    { ...TEST_PROJECT_EDIT_FORM_STATE },
    submit_form_mock,
    true,
  ]);

  render(<EditProjectForm form_state={TEST_PROJECT_EDIT_FORM_STATE} />);
  // <div class="loader" show.bind="isLoading" role="alert" aria-label="Loading"></div>
  // https://stackoverflow.com/questions/38704467/how-to-label-a-loading-animation-for-wai-aria -
  // Most of the answers here are just wrong lol. Aria-busy does not announce to screen
  // readers.
  expect(
    screen.queryByRole("alert", {
      name: /loading/i,
    }),
  ).toBeInTheDocument();
});

test("updating the project redirects user if slug changed", async () => {
  (useProjectEditFormActionState as jest.Mock).mockImplementationOnce(() => [
    { ...TEST_PROJECT_EDIT_FORM_STATE, slug: "testing_not_the_same" },
    jest.fn(),
  ]);

  render(<EditProjectForm form_state={TEST_PROJECT_EDIT_FORM_STATE} />);

  await waitFor(() =>
    expect(mock_push).toHaveBeenCalledWith(
      "/admin/projects/testing_not_the_same/edit",
    ),
  );
});

test("updating the project does not redirect the user if the slug remains the same", async () => {
  (useProjectEditFormActionState as jest.Mock).mockImplementationOnce(() => [
    { ...TEST_PROJECT_EDIT_FORM_STATE },
    jest.fn(),
  ]);

  render(<EditProjectForm form_state={TEST_PROJECT_EDIT_FORM_STATE} />);

  expect(mock_push).not.toHaveBeenCalled();
});
