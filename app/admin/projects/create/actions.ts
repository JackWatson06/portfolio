"use server";

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

export enum ServerActionCode {
  SUCCESS = 0,
  UNAUTHENTICATED,
}

export type ServerActionResult = {
  code: ServerActionCode;
  errors: string[];
};

export async function handleProjectFormAction(
  input: ProjectCreateInput,
): Promise<ServerActionResult> {
  return {
    code: ServerActionCode.SUCCESS,
    errors: [],
  };
}
