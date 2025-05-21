import CreateProjectForm from "@/app/admin/projects/create/CreateProjectForm";
import { useProjectCreateFormActionState } from "@/app/admin/projects/hooks";
import { ProjectFormState } from "@/app/admin/projects/schemas";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";

/**
 * TODO: I got rid of the tests for setting the value becuase that's essentially testing the contract
 * with the child components (essentially testing we call the children correctly). Not a bad thing
 * but may apply more through integration testing.
 */

/* -------------------------------------------------------------------------- */
/*                                    Mocks                                   */
/* -------------------------------------------------------------------------- */
const DEFAULT_FORM_STATE: ProjectFormState = {
  data: {
    name: "testing",
    description: "testing",
    tags: "testing",
    visibility: "private",
    media: [
      {
        file: new File(["testing"], "testing.png", {
          type: "image/png",
        }),
        description: "testing",
      },
    ],
    existing_media: [],
    thumbnail: "testing.png",
    links: [
      {
        url: "https://testing.com",
        type: "website",
      },
    ],
    live_project_link: "https://testing.com",
  },
  errors: [],
};

jest.mock("@/app/admin/projects/hooks", () => ({
  useProjectCreateFormActionState: jest.fn(() => [
    { ...DEFAULT_FORM_STATE },
    jest.fn(),
  ]),
}));

jest.mock("react", () => {
  return {
    ...jest.requireActual("react"),
    useEffect: jest.fn(), // Mocking this because we don't have the DataTransfer API in jsdom.
  };
});

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */
test("admin project create form renders valid HTML", async () => {
  const { container } = render(<CreateProjectForm />);

  expect(container.innerHTML).toHTMLValidate();
});

test("submitting a valid form", async () => {
  // Arrange
  const submit_form_mock = jest.fn();
  (useProjectCreateFormActionState as jest.Mock).mockImplementationOnce(() => [
    { ...DEFAULT_FORM_STATE },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  // Act
  render(<CreateProjectForm />);

  // Looks like theres an issue with the required file input field and checking the forms input validity with the
  // DOM interaction library.
  // https://github.com/testing-library/user-event/issues/1133
  const media_input = screen.getByLabelText(/upload media/i);
  media_input.removeAttribute("required");

  // Upload a file.
  const testing_one_file = new File(["testing"], "testing.png", {
    type: "image/png",
  });
  await user.upload(media_input, [testing_one_file]);

  // Get and set the required frields.
  const description_input = screen.getByRole("textbox", {
    name: /testing\.png description/i,
  });
  const thumbnail_input = screen.getByRole("textbox", {
    name: /thumbnail/i,
  });

  description_input.setAttribute("value", "testing");
  thumbnail_input.setAttribute("value", "testing.png");

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  // Assert
  expect(submit_form_mock).toHaveBeenCalled();
});

test("displaying loading when pending upload", () => {
  const submit_form_mock = jest.fn();
  (useProjectCreateFormActionState as jest.Mock).mockImplementationOnce(() => [
    { ...DEFAULT_FORM_STATE },
    submit_form_mock,
    true,
  ]);

  render(<CreateProjectForm />);
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
