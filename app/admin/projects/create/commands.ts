type ProjectCreateResponse = {
  errors: string[];
};

export async function handleProjectFormAction(
  prev_state: any,
  form_data: FormData,
): Promise<ProjectCreateResponse> {
  return {
    errors: [],
  };
}
