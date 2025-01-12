import {
  TEST_PROJECT_ONE,
  TEST_PROJECT_THREE,
  TEST_PROJECT_TWO,
} from "@/__tests__/seeding/ProjectData";
import { ProjectListView } from "../queries";

export const TEST_ADMIN_PROJECT_LIST_VIEW: ProjectListView = [
  {
    created_at: "1/1/2020, 12:21:00 PM",
    updated_at: "2/1/2020, 1:00:00 AM",
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
    created_at: "1/1/2020, 12:21:00 PM",
    updated_at: "2/1/2020, 1:00:00 AM",
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
    created_at: "1/1/2020, 12:21:00 PM",
    updated_at: "2/1/2020, 1:00:00 AM",
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

export const fetchProjectListView = jest.fn().mockImplementation(() => {
  return TEST_ADMIN_PROJECT_LIST_VIEW;
});
