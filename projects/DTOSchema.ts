export type LinkInput = {
  type: string;
  url: string;
};

export type MediaInput = {
  mime_type: string;
  url: string;
  hash: string;
  description: string;
};

export type ProjectCreate = {
  name: string;
  description: string;
  tags: string[];
  thumbnail_media: {
    url: string;
    description: string;
  };
  live_project_link?: string;
  media: MediaInput[];
  links: LinkInput[];
  private: boolean;
};

export type ProjectUpdate = Partial<ProjectCreate> & {
  removed_media_hashes?: string[];
};
