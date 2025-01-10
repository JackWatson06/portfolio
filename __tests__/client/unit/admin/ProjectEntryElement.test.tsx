import ProjectListElement from "@/app/admin/projects/ProjectEntryElement";
import { ProjectListElementView } from "@/app/admin/projects/queries";
import "@testing-library/jest-dom";
import {
  ByRoleMatcher,
  ByRoleOptions,
  render,
  within,
} from "@testing-library/react";
import "html-validate/jest";

const project_entry_view: ProjectListElementView = {
  title: "gandalf",
  created_at: "2020-01-01 12:21 pm",
  updated_at: "2020-02-01 1:00 am",
  thumbnail_media: {
    url: "/assets/images/gandalf.png",
    description: "Picture of Gandalf holding a staff.",
  },
  private: true,
  tags: ["c++", "web", "tailwind"],
  view_link: "/projects/gandalf/edit",
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
};

type RenderGetByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined,
) => HTMLElement;
function getSectionByHeader(
  header: RegExp,
  getByRole: RenderGetByRole,
): HTMLElement {
  const closest_section = getByRole("heading", {
    name: header,
  }).closest("section");

  if (closest_section == null) {
    throw new Error("Header not nested within a section tag.");
  }

  return closest_section;
}

test("project list element has valid HTML.", () => {
  const { container } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("rendering the name of the project.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(queryByRole("heading", { name: /^gandalf/i })).not.toBe(null);
});

test("marking a project as public.", () => {
  const { queryByRole } = render(
    <ProjectListElement
      project={{
        ...project_entry_view,
        private: false,
      }}
    />,
  );

  expect(queryByRole("status")).toHaveTextContent(/public/i);
});

test("marking a project as private.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(queryByRole("status")).toHaveTextContent(/private/i);
});

test.each([[/^c\+\+$/i], [/^web$/i], [/^tailwind$/i]])(
  "displaying the tag. Tag: %s",
  (query: RegExp) => {
    const { getByRole } = render(
      <ProjectListElement project={project_entry_view} />,
    );

    const tag_section_element = getSectionByHeader(/tags/i, getByRole);
    expect(within(tag_section_element).queryByText(query)).toBeInTheDocument();
  },
);

test("displaying the thumbnail image for the project.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("img", {
      name: "Picture of Gandalf holding a staff.",
    }),
  ).toBeInTheDocument();
});

test("displaying the correct link for editing a project.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("link", {
      name: "Edit gandalf",
    }),
  ).toHaveAttribute("href", "/admin/projects/gandalf/edit");
});

test.each(
  project_entry_view.media_files.map((media_file) => {
    return [media_file.url];
  }),
)("displaying the URL for a media element. URL: %s", (url: string) => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const media_section_element = getSectionByHeader(/media\ files/i, getByRole);
  expect(within(media_section_element).queryByText(url)).toBeInTheDocument();
});

test("displaying the mime type for a media element.", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const media_section_element = getSectionByHeader(/media\ files/i, getByRole);
  expect(
    within(media_section_element).queryByText(/^image\/png$/i),
  ).toBeInTheDocument();
});

test("displaying the description for a media element.", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const media_section_element = getSectionByHeader(/media\ files/i, getByRole);
  expect(
    within(media_section_element).queryByText(
      /^Picture of Gandalf holding a staff\.$/i,
    ),
  ).toBeInTheDocument();
});

test.each(
  project_entry_view.links.map((link) => {
    return [link.url];
  }),
)("displaying the URL for a link. URL: %s", (url: string) => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const link_section_element = getSectionByHeader(/links/i, getByRole);
  expect(within(link_section_element).queryByText(url)).toBeInTheDocument();
});

test("displaying the type for a link.", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const link_section_element = getSectionByHeader(/links/i, getByRole);
  expect(within(link_section_element).queryByText("live")).toBeInTheDocument();
});

test("displaying the live status for a link.", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const link_section_element = getSectionByHeader(/links/i, getByRole);
  expect(
    within(link_section_element).queryByText(/^yes$/i),
  ).toBeInTheDocument();
});

test("displaying the created at date.", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const timestamp_section = getSectionByHeader(/timestamps/i, getByRole);
  expect(
    within(timestamp_section).queryByText("2020-01-01 12:21 pm"),
  ).toBeInTheDocument();
});

test("displaying the last edited date.", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const timestamp_section = getSectionByHeader(/timestamps/i, getByRole);
  expect(
    within(timestamp_section).queryByText("2020-02-01 1:00 am"),
  ).toBeInTheDocument();
});

test("displaying the delete button.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("button", {
      name: /delete gandalf/i,
    }),
  ).toBeInTheDocument();
});

test("displaying the edit link.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("link", {
      name: /edit gandalf/i,
    }),
  ).toBeInTheDocument();
});

test("displaying the view link.", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("link", {
      name: /view gandalf/i,
    }),
  ).toBeInTheDocument();
});
