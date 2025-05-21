import { init } from "@/services/setup";
import { ProjectFormState } from "../../schemas";

export async function fetchProjectBySlug(
  slug: string,
): Promise<ProjectFormState | null> {
  const portfolio_service_locator = await init();

  const project = await portfolio_service_locator.project.find(slug);
  if (!project) {
    return null;
  }

  return {
    errors: [],
    slug: project.slug,
    data: {
      name: project.name,
      description: project.description,
      tags: project.tags.join(", "),
      visibility: project.private ? "private" : "public",
      media: [],
      existing_media: project.media,
      thumbnail: project.thumbnail_media.url,
      links: project.links,
      live_project_link: project.live_project_link
        ? project.live_project_link
        : "",
    },
  };
}
