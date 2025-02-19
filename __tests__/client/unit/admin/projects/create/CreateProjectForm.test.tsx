import CreateProjectForm from "@/app/admin/projects/create/CreateProjectForm";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";
import { useActionState } from "react";

jest.mock("@/app/admin/projects/create/actions", () => ({
  handleProjectFormAction: jest.fn(),
}));

jest.mock("react", () => {
  return {
    ...jest.requireActual("react"),
    useActionState: jest.fn(),
  };
});

type ProjectFormInputs = {
  name: HTMLElement;
  markdown_description: HTMLTextAreaElement;
  tags: HTMLElement;
  visibility: HTMLElement;
  thumbnail: HTMLElement;
  live_link: HTMLElement;
};

function seedFormDefaults(): ProjectFormInputs {
  const name_input = screen.getByLabelText(/name/i);
  const markdown_description_input = screen.getByLabelText(
    /markdown description/i,
  ) as HTMLTextAreaElement;
  const tags_input = screen.getByLabelText(/tags/i);
  const visibility_input = screen.getByLabelText(/visibility/i);
  const thumbnail_input = screen.getByLabelText(/thumbnail image/i);
  const live_link_input = screen.getByLabelText(/live project link/i);

  name_input.setAttribute("value", "Testing");
  markdown_description_input.value = "test";
  tags_input.setAttribute("value", "C++, TypeScript, Jest");
  visibility_input.setAttribute("value", "private");
  thumbnail_input.setAttribute("value", "testing.txt");
  live_link_input.setAttribute("value", "https://testing.com/project");

  return {
    name: name_input,
    markdown_description: markdown_description_input,
    tags: tags_input,
    visibility: visibility_input,
    thumbnail: thumbnail_input,
    live_link: live_link_input,
  };
}

beforeEach(() => {
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    jest.fn(),
  ]);
});

test("admin project create form renders valid HTML.", async () => {
  const { container } = render(<CreateProjectForm />);

  expect(container.innerHTML).toHTMLValidate();
});

test("submitting a valid form.", async () => {
  const submit_form_mock = jest.fn();
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  render(<CreateProjectForm />);
  seedFormDefaults();
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).toHaveBeenCalled();
});

test("form requires a title", async () => {
  const submit_form_mock = jest.fn();
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  render(<CreateProjectForm />);
  const inputs = seedFormDefaults();
  inputs.name.setAttribute("value", "");
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("form requires a description", async () => {
  const submit_form_mock = jest.fn();
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  render(<CreateProjectForm />);
  const inputs = seedFormDefaults();
  inputs.markdown_description.value = "";
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("form requires a thumbnail", async () => {
  const submit_form_mock = jest.fn();
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
    submit_form_mock,
  ]);
  const user = userEvent.setup();

  render(<CreateProjectForm />);
  const inputs = seedFormDefaults();
  inputs.thumbnail.setAttribute("value", "");
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("displaying loading when pending upload", () => {
  const submit_form_mock = jest.fn();
  (useActionState as jest.Mock).mockImplementation(() => [
    { errors: [] },
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
