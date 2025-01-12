export interface Project {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnail_media: {
    url: string;
    description: string;
  };
  live_project_link?: string;
  media: Array<MediaElement>;
  links: Array<Link>;
  private: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type MediaElement = {
  mime_type: string;
  url: string;
  description: string;
};

export type Link = {
  type: string;
  url: string;
};
