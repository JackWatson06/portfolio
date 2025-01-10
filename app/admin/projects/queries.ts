export type MediaFileView = {
  url: string;
  mime_type: string;
  description: string;
};

export type LinkView = {
  type: string;
  url: string;
};

export type ThumbnailView = {
  url: string;
  description: string;
};

export type ProjectListElementView = {
  title: string;
  created_at: string;
  updated_at: string;
  thumbnail_media: ThumbnailView;
  private: boolean;
  tags: string[];
  view_link: string;
  edit_link: string;
  media_files: MediaFileView[];
  links: LinkView[];
};
export type ProjectListView = ProjectListElementView[];

export function fetchProjectListView(): ProjectListView {
  return [
    {
      title: "gandalf",
      created_at: "2020-01-01 12:21 pm",
      updated_at: "2020-02-01 1:00 am",
      thumbnail_media: {
        url: "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/22326168/gandalf_shire_lord_of_the_rings.jpg",
        description: "Picture of Gandalf holding a staff.",
      },
      private: true,
      tags: ["c++", "web", "tailwind"],
      view_link: "/projects/gandalf",
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
        },
        {
          type: "source",
          url: "https://github.com/project",
        },
        {
          type: "media",
          url: "https://youtube.com/video",
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
      view_link: "/projects/gandalf",
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
          url: "/assets/images/aragorn.jpg dfdafdsafdsafdasfdasfdsafdafdasda",
          mime_type: "image/jpeg",
          description: "Aragorn kicking butt.",
        },
      ],
      links: [
        {
          type: "live",
          url: "https://localhost:8080/project",
        },
        {
          type: "source",
          url: "https://github.com/project",
        },
        {
          type: "media",
          url: "https://youtube.com/video",
        },
      ],
    },
    {
      title: "aragorn",
      created_at: "2020-01-01 12:21 pm",
      updated_at: "2020-02-01 1:00 am",
      thumbnail_media: {
        url: "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/22326168/gandalf_shire_lord_of_the_rings.jpg",
        description: "Picture of Gandalf holding a staff.",
      },
      private: true,
      tags: ["c++", "web", "tailwind"],
      view_link: "/projects/gandalf",
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
        },
        {
          type: "source",
          url: "https://github.com/project",
        },
        {
          type: "media",
          url: "https://youtube.com/video",
        },
      ],
    },
  ];
}
