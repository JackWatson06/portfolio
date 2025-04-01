import ProjectListElement from "./ProjectEntryElement";
import { fetchProjectListView } from "./queries";

export default async function Projects() {
  const projects = await fetchProjectListView();

  return (
    <>
      <header className="container mx-auto">
        <h1 className="text-2xl">Projects</h1>
      </header>

      <main className="container mx-auto">
        {projects.length == 0 ? (
          <p>No projects found - add some of your work!</p>
        ) : (
          <ul className="space-y-10">
            {projects.map((project_entry_view) => {
              return (
                <ProjectListElement
                  key={project_entry_view.title}
                  project={project_entry_view}
                />
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
