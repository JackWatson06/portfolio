import EditProjectForm from "./EditProjectForm";
import { fetchProjectBySlug } from "./queries";

export default async function EditProject({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const project = await fetchProjectBySlug((await params).slug);

  if (!project) {
    return (
      <header className="mx-auto mt-4 w-xs">
        <h1 className="text-2xl">
          Could not find the project to edit with slug: {slug}
        </h1>
      </header>
    );
  }

  return (
    <>
      <header className="mx-auto mt-4 w-xs">
        <h1 className="text-2xl">Edit {project.data.name} Form</h1>
      </header>
      <main className="mx-auto w-xs">
        <EditProjectForm slug={slug} form_state={project} />
      </main>
    </>
  );
}
