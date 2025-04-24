import { TEST_PROJECT_ONE } from "@/__tests__/seeding/projects/ProjectData";
import { fetchProjectBySlug } from "@/app/admin/projects/[slug]/edit/queries";
import { ProjectFormState } from "@/app/admin/projects/schemas";
import { init } from "@/services/setup";

jest.mock("@/services/setup");

test("fetching form state returns null when project can not be found", async () => {
  ((await init()).project.find as jest.Mock).mockReturnValueOnce(null);

  const result = await fetchProjectBySlug("testing");

  expect(result).toBeNull();
});

test("fetching transforms project into form state", async () => {
  const result = await fetchProjectBySlug("testing");

  const expected_form_state: ProjectFormState = {
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
  expect(result).toEqual(expected_form_state);
});
