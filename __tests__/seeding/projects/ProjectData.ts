import { ProjectCreate } from "@/projects/DTOSchema";
import { Project } from "@/services/db/schemas/Project";

export const TEST_PROJECT_ONE_CREATE_INPUT: ProjectCreate = {
  name: "Gandalf",
  description:
    "Project demonstrating the god like ability of Gandalf the Grey.",
  tags: ["MongoDB", "Web", "Tailwind"],
  thumbnail_media: {
    url: "/assets/testing_gandalf",
    description: "Picture of Gandalf holding a staff.",
  },
  live_project_link: "https://gandalf.com",
  media: [
    {
      url: "/assets/testing_aragorn",
      mime_type: "image/jpeg",
      hash: "testing_aragorn",
      description: "Aragorn kicking butt.",
    },
    {
      url: "/assets/testing_frodo",
      mime_type: "image/webp",
      hash: "testing_frodo",
      description: "Frodo dancing on the table.",
    },
    {
      url: "/assets/testing_gandalf",
      mime_type: "image/png",
      hash: "testing_gandalf",
      description: "Picture of Gandalf holding a staff.",
    },
    {
      url: "/assets/testing_sam",
      mime_type: "video/mp4",
      hash: "testing_sam",
      description: "Sam running across the shire.",
    },
  ],
  links: [
    {
      url: "https://gandalf.com",
      type: "website",
    },
    {
      url: "https://testing.com/gandalf",
      type: "download",
    },
    {
      url: "https://github.com/project/gandalf",
      type: "source",
    },
  ],
  private: false,
};

export const TEST_PROJECT_ONE: Project = {
  ...TEST_PROJECT_ONE_CREATE_INPUT,
  slug: "gandalf",
  created_at: new Date("2020-01-01T12:21Z"),
  updated_at: new Date("2020-02-01T01:00Z"),
};

export const TEST_PROJECT_TWO: Project = {
  name: "Bilbo Baggins",
  slug: "bilbo_baggins",
  description: "Bilbo tired from past adventures rests easy in Rivendell.",
  tags: ["c++", "desktop", "linux"],
  thumbnail_media: {
    url: "/assets/images/bilbo.jpg",
    description: "Picture of Gandalf holding a staff.",
  },
  live_project_link: "https://testing.com/bilbo",
  media: [
    {
      url: "/assets/videos/sam.mp4",
      mime_type: "video/mp4",
      hash: "12323123",
      description: "Sam running across the shire.",
    },
    {
      url: "/assets/images/bilbo.jpg",
      mime_type: "image/jpg",
      hash: "12323123",
      description: "Bilbo baggins sneaking around.",
    },
  ],
  links: [
    {
      type: "download",
      url: "https://testing.com/bilbo",
    },
    {
      type: "source",
      url: "https://github.com/project/bilbo",
    },
  ],
  private: true,
  created_at: new Date("2020-01-01T12:21Z"),
  updated_at: new Date("2020-02-01T01:00Z"),
};

export const TEST_PROJECT_THREE: Project = {
  name: "Aragorn",
  slug: "aragorn",
  description: "Aragorn riding around on a horse.",
  tags: ["Video Game", "Unity", "C#"],
  thumbnail_media: {
    url: "/assets/images/aragorn.jpg",
    description: "Aragorn kicking butt.",
  },
  media: [
    {
      url: "/assets/images/frodo.webp",
      mime_type: "image/webp",
      hash: "123123123",
      description: "Frodo dancing on the table.",
    },
    {
      url: "/assets/videos/sam.mp4",
      mime_type: "video/mp4",
      hash: "123123123",
      description: "Sam running across the shire.",
    },
    {
      url: "/assets/images/aragorn.jpg",
      mime_type: "image/jpg",
      hash: "123123123",
      description: "Aragorn kicking butt.",
    },
  ],
  links: [
    {
      type: "source",
      url: "https://github.com/projects/aragorn",
    },
  ],
  private: false,
  created_at: new Date("2020-01-01T12:21Z"),
  updated_at: new Date("2020-02-01T01:00Z"),
};
