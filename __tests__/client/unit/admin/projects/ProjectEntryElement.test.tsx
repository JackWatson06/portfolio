import { TEST_ADMIN_PROJECT_LIST_VIEW } from "@/__tests__/seeding/projects/ProjectViewData";
import ProjectListElement from "@/app/admin/projects/ProjectEntryElement";
import { ProjectListElementView } from "@/app/admin/projects/schemas";
import "@testing-library/jest-dom";
import {
  ByRoleMatcher,
  ByRoleOptions,
  render,
  within,
} from "@testing-library/react";
import "html-validate/jest";

const project_entry_view: ProjectListElementView =
  TEST_ADMIN_PROJECT_LIST_VIEW[0];

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

test("project list element has valid HTML", () => {
  const { container } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("rendering the name of the project", () => {
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

test("marking a project as private", () => {
  const { queryByRole } = render(
    <ProjectListElement
      project={{
        ...project_entry_view,
        private: true,
      }}
    />,
  );

  expect(queryByRole("status")).toHaveTextContent(/private/i);
});

test.each([[/^MongoDB$/i], [/^Web$/i], [/^Tailwind$/i]])(
  "displaying the tag. Tag: %s",
  (query: RegExp) => {
    const { getByRole } = render(
      <ProjectListElement project={project_entry_view} />,
    );

    const tag_section_element = getSectionByHeader(/tags/i, getByRole);
    expect(within(tag_section_element).queryByText(query)).toBeInTheDocument();
  },
);

test("displaying the thumbnail image for the project", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("img", {
      name: "Picture of Gandalf holding a staff.",
    }),
  ).toBeInTheDocument();
});

test("displaying the correct link for editing a project", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("link", {
      name: "Edit Gandalf",
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

test("displaying the mime type for a media element", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const media_section_element = getSectionByHeader(/media\ files/i, getByRole);
  expect(
    within(media_section_element).queryByText(/^image\/png$/i),
  ).toBeInTheDocument();
});

test("displaying the description for a media element", () => {
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

test("displaying the type for a link", () => {
  const { getByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  const link_section_element = getSectionByHeader(/links/i, getByRole);
  expect(
    within(link_section_element).queryByText("website"),
  ).toBeInTheDocument();
});

test("displaying the created at date", () => {
  const { getByRole } = render(
    <ProjectListElement
      project={{
        ...project_entry_view,
        created_at: "1/1/2020, 12:21:00 PM",
      }}
    />,
  );

  const timestamp_section = getSectionByHeader(/timestamps/i, getByRole);
  expect(
    within(timestamp_section).queryByText("1/1/2020, 12:21:00 PM"),
  ).toBeInTheDocument();
});

test("displaying the last edited date", () => {
  const { getByRole } = render(
    <ProjectListElement
      project={{
        ...project_entry_view,
        updated_at: "2/1/2020, 1:00:00 AM",
      }}
    />,
  );

  const timestamp_section = getSectionByHeader(/timestamps/i, getByRole);
  expect(
    within(timestamp_section).queryByText("2/1/2020, 1:00:00 AM"),
  ).toBeInTheDocument();
});

test("displaying the delete button", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("button", {
      name: /delete gandalf/i,
    }),
  ).toBeInTheDocument();
});

test("displaying the edit link", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("link", {
      name: /edit gandalf/i,
    }),
  ).toBeInTheDocument();
});

test("displaying the view link", () => {
  const { queryByRole } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(
    queryByRole("link", {
      name: /view gandalf/i,
    }),
  ).toBeInTheDocument();
});
