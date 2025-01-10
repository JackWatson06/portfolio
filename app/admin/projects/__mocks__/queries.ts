import { ProjectListView } from "../queries"

const mock_project_list: ProjectListView = [
  {
    title: "gandalf",
    created_at: "2020-01-01 12:21 pm",
    updated_at: "2020-02-01 1:00 am",
    thumbnail_media: {
      url: "/assets/images/gandalf.png",
      description: "Picture of Gandalf holding a staff.",
    },
    private: true,
    tags: ["c++", "web", "tailwind"],
    view_link: "/projects/gandalf/",
    edit_link: "/admin/projects/gandalf/edit",
    media_files: [
      {
        url: "/assets/images/gandalf.png",
        mime_type: "image/png",
        description: "Picture of Gandalf holding a staff.",
      },
      {
        url: "/assets/images/frodo.webp",
        mime_type: "image/webp",
        description: "Frodo dancing on the table.",
      },
      {
        url: "/assets/videos/sam.mp4",
        mime_type: "video/mp4",
        description: "Sam running across the shire.",
      },
      {
        url: "/assets/images/aragorn.jpg",
        mime_type: "image/jpeg",
        description: "Aragorn kicking butt.",
      },
    ],
    links: [
      {
        type: "live",
        url: "https://localhost:8080/project",
        live: "Yes",
      },
      {
        type: "source",
        url: "https://github.com/project",
        live: "No",
      },
      {
        type: "media",
        url: "https://youtube.com/video",
        live: "No",
      },
    ],
  },
  {
    title: "bilbo",
    created_at: "2020-01-01 12:21 pm",
    updated_at: "2020-02-01 1:00 am",
    thumbnail_media: {
      url: "/assets/images/gandalf.png",
      description: "Picture of Gandalf holding a staff.",
    },
    private: true,
    tags: ["c++", "web", "tailwind"],
    view_link: "/projects/gandalf/",
    edit_link: "/admin/projects/gandalf/edit",
    media_files: [
      {
        url: "/assets/images/gandalf.png",
        mime_type: "image/png",
        description: "Picture of Gandalf holding a staff.",
      },
      {
        url: "/assets/images/frodo.webp",
        mime_type: "image/webp",
        description: "Frodo dancing on the table.",
      },
      {
        url: "/assets/videos/sam.mp4",
        mime_type: "video/mp4",
        description: "Sam running across the shire.",
      },
      {
        url: "/assets/images/aragorn.jpg",
        mime_type: "image/jpeg",
        description: "Aragorn kicking butt.",
      },
    ],
    links: [
      {
        type: "live",
        url: "https://localhost:8080/project",
        live: "Yes",
      },
      {
        type: "source",
        url: "https://github.com/project",
        live: "No",
      },
      {
        type: "media",
        url: "https://youtube.com/video",
        live: "No",
      },
    ],
  },
  {
    title: "aragorn",
    created_at: "2020-01-01 12:21 pm",
    updated_at: "2020-02-01 1:00 am",
    thumbnail_media: {
      url: "/assets/images/gandalf.png",
      description: "Picture of Gandalf holding a staff.",
    },
    private: true,
    tags: ["c++", "web", "tailwind"],
    view_link: "/projects/gandalf/",
    edit_link: "/admin/projects/gandalf/edit",
    media_files: [
      {
        url: "/assets/images/gandalf.png",
        mime_type: "image/png",
        description: "Picture of Gandalf holding a staff.",
      },
      {
        url: "/assets/images/frodo.webp",
        mime_type: "image/webp",
        description: "Frodo dancing on the table.",
      },
      {
        url: "/assets/videos/sam.mp4",
        mime_type: "video/mp4",
        description: "Sam running across the shire.",
      },
      {
        url: "/assets/images/aragorn.jpg",
        mime_type: "image/jpeg",
        description: "Aragorn kicking butt.",
      },
    ],
    links: [
      {
        type: "live",
        url: "https://localhost:8080/project",
        live: "Yes",
      },
      {
        type: "source",
        url: "https://github.com/project",
        live: "No",
      },
      {
        type: "media",
        url: "https://youtube.com/video",
        live: "No",
      },
    ],
  }
]

export const fetchProjectListView = jest.fn().mockImplementation(() => {
  return mock_project_list
})