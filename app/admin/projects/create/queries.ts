"use server";

import { MediaUploadParams } from "@/media/upload/MediaUploadDTOSchema";
import { Project } from "@/services/db/schemas/Project";
import { init } from "@/services/setup";
import { WithId } from "mongodb";
import { cookies } from "next/headers";

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
