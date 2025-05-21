import ProjectMetadataInput from "@/app/admin/projects/ProjectMetadataInput";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";

test("admin project meta data input renders valid HTML.", async () => {
  const { container } = render(
    <ProjectMetadataInput
      value_name=""
      value_description="testing"
      value_tags="testing"
      value_visibility="visibility"
    />,
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("form requires a name", async () => {
  const submit_form_mock = jest.fn();
  const user = userEvent.setup();

  render(
    <form action={submit_form_mock}>
      <ProjectMetadataInput
        value_name=""
        value_description="testing"
        value_tags="testing"
        value_visibility="visibility"
      />
      <button type="submit">submit</button>
    </form>,
  );

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });

  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("form requires a description", async () => {
  const submit_form_mock = jest.fn();
  const user = userEvent.setup();

  render(
    <form action={submit_form_mock}>
      <ProjectMetadataInput
        value_name="testing"
        value_description=""
        value_tags="testing"
        value_visibility="visibility"
      />
      <button type="submit">submit</button>
    </form>,
  );

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });

  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});
