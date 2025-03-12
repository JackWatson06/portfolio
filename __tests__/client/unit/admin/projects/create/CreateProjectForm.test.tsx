import CreateProjectForm from "@/app/admin/projects/create/CreateProjectForm";
import {
  ProjectFormState,
  useProjectFormActionState,
} from "@/app/admin/projects/create/hooks";
import "@testing-library/jest-dom";
import { fireEvent, logRoles, render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "html-validate/jest";
import { useActionState } from "react";

/* -------------------------------------------------------------------------- */
/*                                    Mocks                                   */
/* -------------------------------------------------------------------------- */
jest.mock("@/app/admin/projects/create/hooks", () => ({
  useProjectFormActionState: jest
    .fn()
    .mockImplementation(() => [{ ...DEFAULT_FORM_STATE }, jest.fn()]),
}));

jest.mock("react", () => {
  return {
    ...jest.requireActual("react"),
    useActionState: jest.fn(),
    useEffect: jest.fn(), // Mocking this because we don't have the DataTransfer API in jsdom.
  };
});

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

async function setMediaInputFields(): Promise<HTMLInputElement> {
  const user = userEvent.setup();

  // Upload file.
  const testing_one_file = new File(["testing"], "testing.png", {
    type: "image/png",
  });

  const media_input = screen.getByLabelText(/upload media/i);
  await user.upload(media_input, [testing_one_file]);

  // Get inputs created after the file upload.
  const description_input = screen.getByRole("textbox", {
    name: /testing\.png description/i,
  });
  const thumbnail_input = screen.getByRole("textbox", {
    name: /thumbnail/i,
  });

  description_input.setAttribute("value", "testing");
  thumbnail_input.setAttribute("value", "testing.png");

  return media_input as HTMLInputElement;
}

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */
test("admin project create form renders valid HTML.", async () => {
  const { container } = render(<CreateProjectForm />);

  expect(container.innerHTML).toHTMLValidate();
});

test("submitting a valid form.", async () => {
  // Arrange
  const submit_form_mock = jest.fn();
  (useProjectFormActionState as jest.Mock).mockImplementationOnce(() => [
    { ...DEFAULT_FORM_STATE },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  // Act
  render(<CreateProjectForm />);

  const media_input = await setMediaInputFields();
  // Looks like theres an issue with the required file input field and checking the forms input validity with the
  // DOM interaction library.
  // https://github.com/testing-library/user-event/issues/1133
  media_input.removeAttribute("required");
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  // Assert
  expect(submit_form_mock).toHaveBeenCalled();
});

test("displaying loading when pending upload", () => {
  const submit_form_mock = jest.fn();
  (useProjectFormActionState as jest.Mock).mockImplementationOnce(() => [
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

/* -------------------------- Test Required Values -------------------------- */
function setNameValue() {
  screen
    .getByRole("textbox", {
      name: /name/i,
    })
    .setAttribute("value", "");
}

function setDescriptionValue() {
  screen
    .getByRole("textbox", {
      name: /markdown description/i,
    })
    .setAttribute("value", "");
}

function setMediaDescriptionsValue() {
  screen
    .getByRole("textbox", {
      name: /testing\.png description/i,
    })
    .setAttribute("value", "");
}

function setThumbnailValue() {
  screen
    .getByRole("textbox", {
      name: /thumbnail/i,
    })
    .setAttribute("value", "");
}

test.each([
  ["name", setNameValue],
  ["description", setDescriptionValue],
  ["media descriptions", setMediaDescriptionsValue],
  ["thumbnail", setThumbnailValue],
])("form requires a %s", async (form_field, attribute_set_callback) => {
  const [state, submit_form_mock] =
    useProjectFormActionState(DEFAULT_FORM_STATE);
  const user = userEvent.setup();

  render(<CreateProjectForm />);
  await setMediaInputFields();
  attribute_set_callback();
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("form requires a media element", async () => {
  const [state, submit_form_mock] =
    useProjectFormActionState(DEFAULT_FORM_STATE);
  const user = userEvent.setup();

  // Act - By note seeding the media files we never set media input.
  render(<CreateProjectForm />);
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

/* ----------------------------- Test Get Values ---------------------------- */
function getNameValue() {
  return screen
    .getByRole("textbox", {
      name: /name/i,
    })
    .getAttribute("value");
}

function getDescriptionValue() {
  return (
    screen.getByRole("textbox", {
      name: /markdown description/i,
    }) as HTMLTextAreaElement
  ).value;
}

function getTagsValue() {
  return screen
    .getByRole("textbox", {
      name: /tags/i,
    })
    .getAttribute("value");
}

function getVisilibityValue() {
  const select_box = screen.getByRole("combobox", {
    name: /visibility/i,
  }) as HTMLSelectElement;
  return select_box.options[select_box.selectedIndex].value;
}

test.each([
  ["name", getNameValue, "testing"],
  ["description", getDescriptionValue, "testing"],
  ["tags", getTagsValue, "testing"],
  ["visibility", getVisilibityValue, "private"],
])(
  "form defaults %s to current state",
  async (form_field, attribute_get_callback, expected_value) => {
    render(<CreateProjectForm />);

    expect(attribute_get_callback()).toBe(expected_value);
  },
);
