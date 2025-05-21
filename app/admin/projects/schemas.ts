export type MediaFormSchema = {
  file: File;
  description: string;
};

export type ExistingMediaFormSchema = {
  url: string;
  hash: string;
  mime_type: string;
  description: string;
};

export type LinkFormSchema = {
  url: string;
  type: string;
};

export type ProjectFormSchema = {
  name: string;
  description: string;
  tags: string;
  visibility: string;
  media: MediaFormSchema[];
  existing_media: ExistingMediaFormSchema[];
  thumbnail: string;
  links: LinkFormSchema[];
  live_project_link: string;
};

export type ProjectFormState = {
  errors: string[];
  slug: string;
  data: ProjectFormSchema;
};

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
