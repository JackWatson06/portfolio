import { LinkInput, MediaInput } from "@/projects/DTOSchema";
import { Link, MediaElement, Project } from "@/services/db/schemas/Project";
import { ObjectId, WithId } from "mongodb";

export function createMediaInputs(): Array<MediaInput> {
  return [
    {
      mime_type: "image/png",
      url: "https://testing.com/picture_one",
    },
    {
      mime_type: "video/mp4",
      url: "https://testing.com/video_one",
    },
  ];
}

export function createLinkInputs(): Array<LinkInput> {
  return [
    {
      type: "website",
      url: "https://testing.com",
    },
    {
      type: "github",
      url: "https://testing.com/github",
    },
  ];
}

export function createMediaElements(): Array<MediaElement> {
  return [
    {
      mime_type: "image/png",
      file_url: "https://testing.com/picture_one",
    },
    {
      mime_type: "video/mp4",
      file_url: "https://testing.com/video_one",
    },
  ];
}

export function createLinks(): Array<Link> {
  return [
    {
      type: "website",
      url: "https://testing.com",
    },
    {
      type: "github",
      url: "https://testing.com/github",
    },
  ];
}

export const TEST_PUBLIC_PROJECT: WithId<Project> = {
  _id: new ObjectId(),
  name: "testing",
  slug: "testing",
  description: "testing",
  tags: ["mongodb", "c++", "typescript"],
  thumbnail_media: "https://testing.com/picture_one",
  live_project_link: "https://testing.com",
  media: [
    {
      mime_type: "image/png",
      file_url: "https://testing.com/picture_one",
    },
    {
      mime_type: "image/png",
      file_url: "https://testing.com/picture_two",
    },
  ],
  links: [
    {
      type: "website",
      url: "https://testing.com",
    },
    {
      type: "github",
      url: "https://github.com/testing",
    },
  ],
  private: false,
};

export const TEST_PRIVATE_PROJECT: WithId<Project> = {
  ...TEST_PUBLIC_PROJECT,
  private: false,
};
