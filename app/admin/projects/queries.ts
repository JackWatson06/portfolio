import { init } from "@/services/setup";

export type MediaFileView = {
  url: string;
  mime_type: string;
  description: string;
};

export type LinkView = {
  type: string;
  url: string;
};

export type ThumbnailView = {
  url: string;
  description: string;
};

export type ProjectListElementView = {
  title: string;
  created_at: string;
  updated_at: string;
  thumbnail_media: ThumbnailView;
  private: boolean;
  tags: string[];
  view_link: string;
  edit_link: string;
  media_files: MediaFileView[];
  links: LinkView[];
};
export type ProjectListView = ProjectListElementView[];

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
