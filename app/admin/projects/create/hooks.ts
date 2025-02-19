// Extract the useActionState to a new hook for uploading the project. This hook will wrap the
// the server action first validating the on the frontend before we upload to Back Blaze.

import { useActionState } from "react";
import { ProjectCreateInput, ProjectCreateResponse } from "./actions";

export type ProjectFormState = {
  errors: string[];
};

export type ProjectFormUpload = (
  initial_state: ProjectFormState,
  form_data: FormData,
) => Promise<ProjectFormState>;

export function useProjectFormActionState(
  action: (input: ProjectCreateInput) => Promise<ProjectCreateResponse>,
): [
  state: ProjectFormState,
  dispatch: (payload: FormData) => void,
  isPending: boolean,
] {
  async function handleFormUploadAction(
    initial_state: ProjectFormState,
    form_data: FormData,
  ): Promise<ProjectFormState> {
    return {
      errors: ["testing", "testing"],
    };
  }

  return useActionState(handleFormUploadAction, {
    errors: [],
  });
}
