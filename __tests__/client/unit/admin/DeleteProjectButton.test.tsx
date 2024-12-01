import DeleteProjectButton from "@/app/admin/projects/DeleteProjectButton";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "html-validate/jest";

test("delete button has valid HTML.", () => {
  const { container } = render(
    <DeleteProjectButton title={"Gandalf"} onSubmit={() => {}} />,
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("opening the dialog using a button click.", async () => {
  const { click } = userEvent.setup();

  const { getByRole, findByRole } = render(
    <DeleteProjectButton title="Gandalf" onSubmit={() => {}} />,
  );

  await click(
    getByRole("button", {
      name: /delete gandalf/i,
    }),
  );

  expect(await findByRole("alert")).not.toBeNull();
});

test("submitting the dialog when we select ok.", async () => {
  const on_submit = jest.fn((e) => e.preventDefault());
  const { click } = userEvent.setup();
  const { getByRole } = render(
    <DeleteProjectButton title="Gandalf" onSubmit={on_submit} />,
  );

  await click(
    getByRole("button", {
      name: /delete gandalf/i,
    }),
  );
  await click(
    getByRole("button", {
      name: /yes/i,
    }),
  );

  expect(on_submit).toHaveBeenCalled();
});

test("closing the dialog when canceling the action.", async () => {
  const { click } = userEvent.setup();
  const { getByRole, queryByRole } = render(
    <DeleteProjectButton title="Gandalf" onSubmit={jest.fn()} />,
  );

  await click(
    getByRole("button", {
      name: /delete gandalf/i,
    }),
  );
  await click(
    getByRole("button", {
      name: /cancel/i,
    }),
  );

  expect(await queryByRole("alert")).toBeNull();
});
