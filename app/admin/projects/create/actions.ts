"use server";

import { ProjectCreate } from "@/projects/DTOSchema";
import { ServiceResult } from "@/projects/ProjectServiceResult";
import { init } from "@/services/setup";
import { cookies } from "next/headers";

export type ProjectCreateActionSuccess = {
  code: "SUCCESS";
};

export type ProjectCreateActionError = {
  code: "ERROR";
  message: string;
};

export async function projectUploadAction(
  project_create: ProjectCreate,
): Promise<ProjectCreateActionSuccess | ProjectCreateActionError> {
  const service_locator = await init();
  const token_script = service_locator.token;
  const session_cookie = (await cookies()).get("session");

  if (
    session_cookie == undefined ||
    !(await token_script.validate(session_cookie.value))
  ) {
    return {
      code: "ERROR",
      message: "User is not authenticated to post a project.",
    };
  }

  try {
    const project_create_result =
      await service_locator.project.create(project_create);

    switch (project_create_result.code) {
      case ServiceResult.SUCCESS:
        return {
          code: "SUCCESS",
        };
      case ServiceResult.DUPLICATE:
        return {
          code: "ERROR",
          message: "Project already exists. Please pick a new name!",
        };
      case ServiceResult.INVALID:
        return {
          code: "ERROR",
          message: project_create_result.message,
        };
    }
  } catch (e) {
    return {
      code: "ERROR",
      message: "Project ran into a server error. Please try again later.",
    };
  }
}
