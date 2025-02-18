import {
  useProjectFormActionState,
  ProjectFormUpload,
  ProjectFormState,
} from "@/app/admin/projects/create/hooks";
import { useActionState } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

function setUpFormData(): FormData {
  const form_data = new FormData();

  form_data.set("title", "Testing");
  form_data.set("description", "test");
  form_data.set("tags", "C++, TypeScript, Jest");
  form_data.set("visibility", "private");
  form_data.set("thumbnail", "testing.txt");
  form_data.set("life_project_link", "https://testing.com/project");

  return form_data;
}

function mockUseActionState(): Promise<ProjectFormState> {
  return new Promise((resolve) => {
    (useActionState as jest.Mock).mockImplementation(
      (action: ProjectFormUpload, initial_state: ProjectFormState) => {
        return [
          initial_state,
          (form_data: FormData) => {
            resolve(action(initial_state, form_data));
          },
        ];
      },
    );
  });
}

test("non existent thumbnail returns error", async () => {
  const returned_errors_promise = mockUseActionState();

  const [errors, handleAction] = useProjectFormActionState(jest.fn());
  const form_data = setUpFormData();

  handleAction(form_data);

  expect((await returned_errors_promise).errors).toHaveLength(2);
});
test.todo("confirming primary link exists");
test.todo("pulling thumbnail description");

test.todo("uploading media files to the file server");
test.todo("using the media link returned by the file server");
test.todo("failing file server upload returns error");
