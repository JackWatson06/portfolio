export type ProjectCreateInput = {
  title: string;
  description: string;
  visibility: string;
  thumbnail: string;
  media: {
    url: string;
    mime_type: string;
    description: string;
  }[];
  links: {
    type: string;
    url: string;
  }[];
  live_project_link?: string;
  tags?: string;
};

export type ProjectCreateResponse = {
  errors: string[];
};

export async function handleProjectFormAction(
  input: ProjectCreateInput,
): Promise<ProjectCreateResponse> {
  return {
    errors: [],
  };
}
