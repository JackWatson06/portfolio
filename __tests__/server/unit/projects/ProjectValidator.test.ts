import { ProjectValidator } from "@/projects/ProjectValidator";
import { TEST_PROJECT_ONE } from "@/__tests__/seeding/projects/ProjectData";

test("successfully validating a project.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate(TEST_PROJECT_ONE);

  expect(validator_result.valid).toBe(true);
});

test("we must have at least one picture.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    ...TEST_PROJECT_ONE,
    media: [
      {
        mime_type: "video/mp4",
        url: "https://testing.com/video_one",
        hash: "123123123",
        description: "video_testing",
      },
    ],
  });

  expect(validator_result.valid).toBe(false);
});

test("media must have valid mime types.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    ...TEST_PROJECT_ONE,
    media: [
      ...TEST_PROJECT_ONE.media,
      {
        mime_type: "mp5",
        url: "https://testing.com/video_two",
        hash: "123123123",
        description: "video_testing",
      },
    ],
  });

  expect(validator_result.valid).toBe(false);
});

test("links must have valid service type.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    ...TEST_PROJECT_ONE,
    links: [
      ...TEST_PROJECT_ONE.links,
      {
        type: "testing",
        url: "https://testing.com/video_two",
      },
    ],
  });

  expect(validator_result.valid).toBe(false);
});

test("we make sure the thumbnail exists.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    ...TEST_PROJECT_ONE,
    thumbnail_media: {
      url: "https://testing.com/does_not_exist",
      description: "testing",
    },
  });

  expect(validator_result.valid).toBe(false);
});

test("we make sure the primary link exists.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    ...TEST_PROJECT_ONE,
    live_project_link: "https://testing.com/does_not_exist",
  });

  expect(validator_result.valid).toBe(false);
});

test("we only allow images for the thumbnail media.", async () => {
  const validator = new ProjectValidator();

  const validator_result = validator.validate({
    ...TEST_PROJECT_ONE,
    thumbnail_media: {
      url: "https://testing.com/video_one",
      description: "testing",
    },
  });

  expect(validator_result.valid).toBe(false);
});
