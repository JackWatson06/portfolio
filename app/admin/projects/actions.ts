"use server";

import { ProjectCreate, ProjectUpdate } from "@/projects/DTOSchema";
import { ServiceResult } from "@/projects/ProjectServiceResult";
import { init } from "@/services/setup";
import { cookies } from "next/headers";
import { MediaUploadParams } from "@/media/upload/MediaUploadDTOSchema";
import { Project } from "@/services/db/schemas/Project";

export type ProjectActionSuccess = {
  code: "SUCCESS";
};

export type ProjectActionUpdateSuccess = {
  code: "SUCCESS";
  slug: string;
};

export type ProjectActionError = {
  code: "ERROR";
  message: string;
};

export async function projectCreateAction(
  project_create: ProjectCreate,
): Promise<ProjectActionSuccess | ProjectActionError> {
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

export async function fetchBlobUploadParameters(
  sha1: string,
): Promise<MediaUploadParams | null> {
  const service_locator = await init();
  const token_script = service_locator.token;
  const session_cookie = (await cookies()).get("session");

  if (
    session_cookie == undefined ||
    !(await token_script.validate(session_cookie.value))
  ) {
    return null;
  }

  return await service_locator.media_upload.findUploadParams(sha1);
}

export async function fetchProjectWithName(
  slug: string,
): Promise<Project | null> {
  const service_locator = await init();
  const token_script = service_locator.token;
  const session_cookie = (await cookies()).get("session");

  if (
    session_cookie == undefined ||
    !(await token_script.validate(session_cookie.value))
  ) {
    return null;
  }

  const project_with_id = await service_locator.project.findByName(slug);
  if (project_with_id == null) {
    return null;
  }

  const { _id, ...project } = project_with_id;
  return project;
}

export async function projectUpdateAction(
  slug: string,
  project_update: ProjectUpdate,
): Promise<ProjectActionUpdateSuccess | ProjectActionError> {
  const service_locator = await init();
  const token_script = service_locator.token;
  const session_cookie = (await cookies()).get("session");

  if (
    session_cookie == undefined ||
    !(await token_script.validate(session_cookie.value))
  ) {
    return {
      code: "ERROR",
      message: "User is not authenticated to update a project.",
    };
  }

  try {
    const project_update_result = await service_locator.project.update(
      slug,
      project_update,
    );

    switch (project_update_result.code) {
      case ServiceResult.SUCCESS:
        return {
          code: "SUCCESS",
          slug: project_update_result.slug,
        };
      case ServiceResult.NOT_FOUND:
        return {
          code: "ERROR",
          message:
            "The project you are editing was not found. Has it changed since you started?",
        };
      case ServiceResult.DUPLICATE:
        return {
          code: "ERROR",
          message: "Project already exists. Please pick a new name!",
        };
      case ServiceResult.COULD_NOT_REMOVE:
        return {
          code: "ERROR",
          message: project_update_result.message,
        };
      case ServiceResult.INVALID:
        return {
          code: "ERROR",
          message: project_update_result.message,
        };
    }
  } catch (e) {
    return {
      code: "ERROR",
      message:
        "Updating a project ran into a server error. Please try again later.",
    };
  }
}
