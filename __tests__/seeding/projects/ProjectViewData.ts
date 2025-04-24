import {
  ProjectFormState,
  ProjectListView,
} from "@/app/admin/projects/schemas";
import {
  TEST_PROJECT_ONE,
  TEST_PROJECT_TWO,
  TEST_PROJECT_THREE,
} from "./ProjectData";

export const TEST_ADMIN_PROJECT_LIST_VIEW: ProjectListView = [
  {
    created_at: TEST_PROJECT_ONE.created_at.toLocaleString(),
    updated_at: TEST_PROJECT_ONE.updated_at.toLocaleString(),
    view_link: "/projects/gandalf/",
    edit_link: "/admin/projects/gandalf/edit",
    title: TEST_PROJECT_ONE.name,
    thumbnail_media: TEST_PROJECT_ONE.thumbnail_media,
    private: TEST_PROJECT_ONE.private,
    tags: TEST_PROJECT_ONE.tags,
    media_files: TEST_PROJECT_ONE.media,
    links: TEST_PROJECT_ONE.links,
  },
  {
    created_at: TEST_PROJECT_ONE.created_at.toLocaleString(),
    updated_at: TEST_PROJECT_ONE.updated_at.toLocaleString(),
    view_link: "/projects/bilbo_baggins/",
    edit_link: "/admin/projects/bilbo_baggins/edit",
    title: TEST_PROJECT_TWO.name,
    thumbnail_media: TEST_PROJECT_TWO.thumbnail_media,
    private: TEST_PROJECT_TWO.private,
    tags: TEST_PROJECT_TWO.tags,
    media_files: TEST_PROJECT_TWO.media,
    links: TEST_PROJECT_TWO.links,
  },
  {
    created_at: TEST_PROJECT_ONE.created_at.toLocaleString(),
    updated_at: TEST_PROJECT_ONE.updated_at.toLocaleString(),
    view_link: "/projects/aragorn/",
    edit_link: "/admin/projects/aragorn/edit",
    title: TEST_PROJECT_THREE.name,
    thumbnail_media: TEST_PROJECT_THREE.thumbnail_media,
    private: TEST_PROJECT_THREE.private,
    tags: TEST_PROJECT_THREE.tags,
    media_files: TEST_PROJECT_THREE.media,
    links: TEST_PROJECT_THREE.links,
  },
];

export const TEST_PROJECT_CREATE_FORM_STATE: ProjectFormState = {
  errors: [],
  data: {
    name: TEST_PROJECT_ONE.name,
    description: TEST_PROJECT_ONE.description,
    tags: TEST_PROJECT_ONE.tags.join(", "),
    visibility: "public",
    media: [],
    existing_media: TEST_PROJECT_ONE.media,
    thumbnail: TEST_PROJECT_ONE.thumbnail_media.url,
    links: TEST_PROJECT_ONE.links,
    live_project_link: TEST_PROJECT_ONE.live_project_link,
  },
};

export const TEST_PROJECT_EDIT_FORM_STATE: ProjectFormState = {
  errors: [],
  data: {
    name: TEST_PROJECT_ONE.name,
    description: TEST_PROJECT_ONE.description,
    tags: TEST_PROJECT_ONE.tags.join(", "),
    visibility: "public",
    media: [],
    existing_media: TEST_PROJECT_ONE.media,
    thumbnail: TEST_PROJECT_ONE.thumbnail_media.url,
    links: TEST_PROJECT_ONE.links,
    live_project_link: TEST_PROJECT_ONE.live_project_link,
  },
};
