import ProjectListElement from "./ProjectEntryElement";
import { fetchProjectListView } from "./queries";

export default async function Projects() {
  const projects = await fetchProjectListView();

  return (
    <main>
      <ul>
        {projects.map((project_entry_view) => {
          return (
            <ProjectListElement
              key={project_entry_view.title}
              project={project_entry_view}
            />
          );
        })}
      </ul>
    </main>
  );
}
