import ProjectListElement from "@/app/admin/projects/ProjectEntryElement";
import { ProjectListElementView } from "@/app/admin/projects/queries";
import "@testing-library/jest-dom";
import { cleanup, getRoles, render, screen } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations)

const project_entry_view: ProjectListElementView = {
  name: "gandalf",
  thumbnail_media: "https://localhost:8080/assets/images/pic-of-gandalf.png",
  thumbnail_media_description: "Picture of Gandalf holding a staff.",
  private: true,
  tags: ["c++", "web", "tailwind"],
};


afterEach(cleanup)

test("we render valid HTML.", () => {
  const { container } = render(
    <ProjectListElement project={project_entry_view} />,
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("we render the name of the project.", () => {
  render(<ProjectListElement project={project_entry_view} />);

  expect(screen.queryByRole("heading", { name: /gandalf/i })).not.toBe(null);
});

test("we mark a entry as public.", () => {
  render(
    <ProjectListElement
      project={{
        ...project_entry_view,
        private: false,
      }}
    />,
  );

  expect(screen.queryByRole("status")).toHaveTextContent(/public/i);
});

test("we mark a entry as private.", () => {
  render(<ProjectListElement project={project_entry_view} />);

  expect(screen.queryByRole("status")).toHaveTextContent(/private/i);
});

test.each([
  [/c\+\+/i,],
  [/web/i],
  [/tailwind/i]
])("the tag is displayed in the document. Tag: %s", (query: RegExp) => {
  render(<ProjectListElement project={project_entry_view} />);

  expect(screen.queryByText(query)).toBeInTheDocument();
});

test("we display the thumbnail image for the project.", () => {
  render(<ProjectListElement project={project_entry_view} />);

  expect(screen.queryByRole("img", {
    name: "Picture of Gandalf holding a staff."
  })).toHaveAttribute('src', 'https://gandalf.com/pic-of-gandalf');
});

test("thumbnail image has correct src.", () => {

});

test("we link the create page with the slug.", () => {});

test("we link the edit page using the slug.", () => {});
