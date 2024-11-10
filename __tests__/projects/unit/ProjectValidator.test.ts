import { ProjectValidator } from "@/projects/ProjectValidator";
import { createLinks, createMediaElements } from "./ProjectTestData";

test("we must have at least one picture.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    name: "testing",
    slug: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: [
      {
        mime_type: "video/mp4",
        file_url: "https://testing.com/video_one",
      },
    ],
    links: createLinks(),
    private: false,
  });

  expect(validator_result.valid).toBe(false);
});

test("media must have valid mime types.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    name: "testing",
    slug: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: [
      ...createMediaElements(),
      {
        mime_type: "mp5",
        file_url: "https://testing.com/video_two",
      },
    ],
    links: createLinks(),
    private: false,
  });

  expect(validator_result.valid).toBe(false);
});

test("links must have valid service type.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    name: "testing",
    slug: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: createMediaElements(),
    links: [
      ...createLinks(),
      {
        type: "testing",
        url: "https://testing.com/video_two",
      },
    ],
    private: false,
  });

  expect(validator_result.valid).toBe(false);
});

test("we make sure the thumbnail exists.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    name: "testing",
    slug: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/does_not_exist",
    live_project_link: "https://testing.com",
    media: createMediaElements(),
    links: createLinks(),
    private: false,
  });

  expect(validator_result.valid).toBe(false);
});

test("we make sure the primary link exists.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    name: "testing",
    slug: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com/does_not_exist",
    media: createMediaElements(),
    links: createLinks(),
    private: false,
  });

  expect(validator_result.valid).toBe(false);
});

test("we only allow images for the thumbnail media.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    name: "testing",
    slug: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/video_one",
    live_project_link: "https://testing.com",
    media: createMediaElements(),
    links: createLinks(),
    private: false,
  });

  expect(validator_result.valid).toBe(false);
});
