"use client";

import Image from "next/image";
import { ProjectListElementView } from "./queries";
import Link from "next/link";
import DeleteProjectButton from "./DeleteProjectButton";
import { PropsWithChildren } from "react";

type ProjectEntryElementProps = {
  project: ProjectListElementView;
};

type CardDefinitionProps = {
  term: string;
  definition: string;
};

type CardSectionProps = PropsWithChildren<{
  header: string;
}>;

function CardDefinitionList({ children }: PropsWithChildren) {
  return <dl className="mx-2 divide-y divide-gray-100">{children}</dl>;
}

function CardDefinition({ term, definition }: CardDefinitionProps) {
  return (
    <div className="grid grid-cols-3 gap-2 p-1">
      <dt className="text-base/6 text-gray-900">{term}</dt>
      <dd className="col-span-2 text-base/6 text-gray-600">{definition}</dd>
    </div>
  );
}

function CardSection({ header, children }: CardSectionProps) {
  return (
    <section className="my-2">
      <h3 className="my-2 text-lg font-medium">{header}</h3>
      {children}
    </section>
  );
}

function CardSectionList({ children }: PropsWithChildren) {
  return <ul className="flex flex-col gap-3">{children}</ul>;
}

export default function ProjectListElement({
  project,
}: ProjectEntryElementProps) {
  return (
    <li className="card bg-base-100 shadow-xl lg:grid lg:grid-cols-3 lg:overflow-hidden">
      <figure className="relative h-96 lg:h-auto lg:rounded-none">
        <Image
          src={project.thumbnail_media.url}
          alt={project.thumbnail_media.description}
          fill={true}
          className="object-cover object-center"
        />
      </figure>
      <section className="card-body lg:col-span-2 lg:grid lg:grid-cols-2">
        <h2 className="card-title">
          {project.title}
          {project.private ? (
            <span className="badge badge-ghost" role="status">
              Private
            </span>
          ) : (
            <span className="badge badge-accent" role="status">
              Public
            </span>
          )}
        </h2>

        <CardSection header="Tags">
          <div className="flex justify-start gap-2">
            {project.tags.map((tag) => {
              return (
                <span key={tag} className="badge badge-ghost">
                  <em>{tag}</em>
                </span>
              );
            })}
          </div>
        </CardSection>

        <CardSection header="Actions">
          <div className="flex items-center justify-start gap-6">
            <Link className="link" href={project.view_link}>
              View {project.title}
            </Link>
            <Link className="link" href={project.edit_link}>
              Edit {project.title}
            </Link>
            <DeleteProjectButton title={project.title} onSubmit={() => {}} />
          </div>
        </CardSection>
        <CardSection header="Timestamps">
          <CardDefinitionList>
            <CardDefinition term="Created At" definition={project.created_at} />
            <CardDefinition term="Updated At" definition={project.updated_at} />
          </CardDefinitionList>
        </CardSection>
      </section>
      <details className="mx-8 mb-8 lg:col-span-3 lg:mt-8 lg:pt-4">
        <summary>{project.title} Project Details</summary>
        <div className="lg:grid lg:grid-cols-2">
          <CardSection header="Media Files">
            <CardSectionList>
              {project.media_files.map((media_file) => {
                return (
                  <li key={media_file.url}>
                    <h4>{media_file.url}</h4>
                    <CardDefinitionList>
                      <CardDefinition
                        term="Mime Type"
                        definition={media_file.mime_type}
                      />
                      <CardDefinition
                        term="Description"
                        definition={media_file.description}
                      />
                    </CardDefinitionList>
                  </li>
                );
              })}
            </CardSectionList>
          </CardSection>

          <CardSection header="Links">
            <CardSectionList>
              {project.links.map((link) => {
                return (
                  <li key={link.url}>
                    <h4>{link.url}</h4>
                    <CardDefinitionList>
                      <CardDefinition term="Type" definition={link.type} />
                    </CardDefinitionList>
                  </li>
                );
              })}
            </CardSectionList>
          </CardSection>
        </div>
      </details>
    </li>
  );
}
