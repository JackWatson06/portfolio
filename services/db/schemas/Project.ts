export interface Project {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnail_media: string;
  live_project_link?: string;
  media: Array<MediaElement>;
  links: Array<Link>;
  private: boolean;
  deleted_at?: Date;
}

export type MediaElement = {
  mime_type: string;
  url: string;
};

export type Link = {
  type: string;
  url: string;
};
