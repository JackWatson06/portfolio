/**
 * TODO: Not all the functions here run are called by the client. fetchProjectListView is not but
 * fetchBlobUploadParameters and fetchProjectWithName are. Should we validate the cookie for
 * fetchProjectListView? This should only be called on the server.
 */
import { init } from "@/services/setup";
import { ProjectListView } from "./schemas";

export async function fetchProjectListView(): Promise<ProjectListView> {
  const portfolio_service_locator = await init();

  return (await portfolio_service_locator.project.findAll([])).map(
    (project) => {
      return {
        title: project.name,
        created_at: project.created_at.toLocaleString(),
        updated_at: project.updated_at.toLocaleString(),
        thumbnail_media: project.thumbnail_media,
        private: project.private,
        tags: project.tags,
        view_link: `/projects/${project.slug}/`,
        edit_link: `/admin/projects/${project.slug}/edit`,
        media_files: project.media,
        links: project.links,
      };
    },
  );
}
