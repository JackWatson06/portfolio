export type LinkInput = {
  type: string;
  url: string;
};

export type MediaInput = {
  mime_type: string;
  url: string;
  description: string;
};

export type ProjectCreate = {
  name: string;
  description: string;
  tags: string[];
  thumbnail_media: string;
  live_project_link?: string;
  media: MediaInput[];
  links: LinkInput[];
  private: boolean;
};

export type ProjectUpdate = Partial<ProjectCreate>;
