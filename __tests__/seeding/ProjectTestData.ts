import { ProjectCreate } from "@/projects/DTOSchema";
import { Project } from "@/services/db/schemas/Project";
import { ObjectId, WithId } from "mongodb";

export const TEST_PROJECT_CREATE_INPUT: ProjectCreate = {
  name: "testing_create",
  description: "testing",
  tags: ["mongodb", "c++", "typescript"],
  thumbnail_media: "https://testing.com/picture_one",
  live_project_link: "https://testing.com",
  media: [
    {
      mime_type: "image/png",
      url: "https://testing.com/picture_one",
      description: "testing"
    },
    {
      mime_type: "video/mp4",
      url: "https://testing.com/video_one",
      description: "testing"
    },
  ],
  links: [
    {
      type: "website",
      url: "https://testing.com",
    },
    {
      type: "github",
      url: "https://testing.com/github",
    },
  ],
  private: false,
}

export const TEST_PROJECT_INSERT: Project = {
  name: "testing",
  slug: "testing",
  description: "testing",
  tags: ["mongodb", "c++", "typescript"],
  thumbnail_media: "https://testing.com/picture_one",
  live_project_link: "https://testing.com",
  media: [
    {
      mime_type: "image/png",
      url: "https://testing.com/picture_one",
      description: "picture_testing"
    },
    {
      mime_type: "video/mp4",
      url: "https://testing.com/video_one",
      description: "video_testing"
    },
  ],
  links: [
    {
      type: "website",
      url: "https://testing.com",
    },
    {
      type: "download",
      url: "https://testing.com",
    },
    {
      type: "source",
      url: "https://testing.com/github",
    },
  ],
  private: false,
  created_at: new Date(),
  updated_at: new Date()
}

export const TEST_PUBLIC_PROJECT: WithId<Project> = {
  ...TEST_PROJECT_INSERT,
  _id: new ObjectId(),
};

export const TEST_PRIVATE_PROJECT: WithId<Project> = {
  ...TEST_PROJECT_INSERT,
  _id: new ObjectId(),
  private: false,
};
