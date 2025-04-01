import CreateProjectForm from "./CreateProjectForm";

export default function CreateProject() {
  return (
    <>
      <header className="mx-auto mt-4 w-xs">
        <h1 className="text-2xl">Project Create Form</h1>
      </header>
      <main className="mx-auto w-xs">
        <CreateProjectForm />
      </main>
    </>
  );
}
