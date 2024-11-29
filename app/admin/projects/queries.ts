
export type ProjectListElementView = {
  name: string,
  thumbnail_media: string,
  thumbnail_media_description: string,
  private: boolean,
  tags: string[]
}
export type ProjectListView = ProjectListElementView[] 

export function fetchProjectListView(): ProjectListView {
  return []
}
