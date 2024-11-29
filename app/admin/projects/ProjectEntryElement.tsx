
import Image from "next/image";
import { ProjectListElementView } from "./queries";

type ProjectEntryElementProps = {
  project: ProjectListElementView;
};

export default function ProjectListElement({
  project,
}: ProjectEntryElementProps) {
  return (
    <li>
      <h1>{project.name}</h1>
      <Image width={100} height={100} src={project.thumbnail_media} alt={project.thumbnail_media_description} />
      {project.private ? (
        <span role="status">
          Private
        </span>
      ) : (
        <span role="status">
          Public
        </span>
      )}
      <section>
        <h3>Tags</h3>
        {project.tags.map((tag) => {
          return <em key={tag}>{tag}</em>
        })}
      </section>
    </li>
  );
}
