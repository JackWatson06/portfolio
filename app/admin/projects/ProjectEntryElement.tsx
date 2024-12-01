'use client'

import Image from "next/image";
import { ProjectListElementView } from "./queries";
import Link from "next/link";
import DeleteProjectButton from "./DeleteProjectButton";

type ProjectEntryElementProps = {
  project: ProjectListElementView;
};

export default function ProjectListElement({
  project,
}: ProjectEntryElementProps) {
  return (
    <li>
      <Image width={100} height={100} src={project.thumbnail_media.url} alt={project.thumbnail_media.description} />
      <h2>{project.title}</h2>
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
      <section>
        <h3>Media Files</h3>
        <ul>
          {project.media_files.map((media_file) => {
            return <li key={media_file.url}>
              <dl>
                <dt>Url</dt>
                <dd>{media_file.url}</dd>
                
                <dt>Mime Type</dt>
                <dd>{media_file.mime_type}</dd>

                <dt>Description</dt>
                <dd>{media_file.description}</dd>
              </dl>

            </li>
          })}
        </ul>
      </section>
      <section>
        <h3>Links</h3>
        <ul>
          {project.links.map((link) => {
            return <li key={link.url}>
              <dl>
                <dt>Url</dt>
                <dd>{link.url}</dd>
                
                <dt>Type</dt>
                <dd>{link.type}</dd>

                <dt>Live Project Page</dt>
                <dd>{link.live}</dd>
              </dl>

            </li>
          })}
        </ul>
      </section>
      <section>
        <h3>Timestamps</h3>
        <dl>
          <dt>Created At:</dt>
          <dd>{project.created_at}</dd>
          
          <dt>Updated At:</dt>
          <dd>{project.updated_at}</dd>
        </dl>
      </section>
      
      <DeleteProjectButton title={project.title} onSubmit={() => {}} />
      <Link href={project.edit_link}>Edit {project.title}</Link>
    </li>
  );
}
