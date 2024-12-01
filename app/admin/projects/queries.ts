

export type MediaFileView = {
  url: string,
  mime_type: string,
  description: string
}

export type LinkView = {
  type: string,
  url: string,
  live: string
}

export type ThumbnailView = {
  url: string,
  description: string
}

export type ProjectListElementView = {
  title: string,
  created_at: string,
  updated_at: string,
  thumbnail_media: ThumbnailView,
  private: boolean,
  tags: string[],
  edit_link: string,
  media_files: MediaFileView[],
  links: LinkView[]
}
export type ProjectListView = ProjectListElementView[] 

export function fetchProjectListView(): ProjectListView {
  return []
}
