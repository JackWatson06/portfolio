import { fetchProjectListView } from "./queries";

export default async function Projects() {
  const projects = await fetchProjectListView();
  
  return (
    <div>
      { projects.map((project_entry_view) => {
        return <h1 key={project_entry_view.name}>
          {project_entry_view.name}
        </h1>
      }) }
    </div>
  );
}
