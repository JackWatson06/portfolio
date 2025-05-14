"use client";

import ProjectMetadataInput from "../ProjectMetadataInput";
import { useProjectCreateFormActionState } from "../hooks";
import LinkInput from "../LinkInput";
import MediaInput from "../MediaInput";
import FormAlert from "@/components/FormAlert";
import { ProjectFormState } from "../schemas";
import { FormEvent, startTransition } from "react";

const DEFAULT_FORM_STATE: ProjectFormState = {
  data: {
    name: "",
    description: "",
    tags: "",
    visibility: "private",
    media: [],
    existing_media: [],
    thumbnail: "",
    links: [],
    live_project_link: "",
  },
  slug: "",
  errors: [],
};

export default function AdminProjectCreateForm() {
  const [state, handleAction, is_pending] =
    useProjectCreateFormActionState(DEFAULT_FORM_STATE);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      handleAction(new FormData(event.currentTarget));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xs flex-col gap-10">
      <FormAlert errors={state.errors} />

      <ProjectMetadataInput
        value_name={state.data.name}
        value_description={state.data.description}
        value_tags={state.data.tags}
        value_visibility={state.data.visibility}
      />
      <MediaInput
        value_media={state.data.media}
        value_thumbnail={state.data.thumbnail}
      />
      <LinkInput
        value_links={state.data.links}
        value_live_project_link={state.data.live_project_link}
      />
      {is_pending ? (
        <div role="alert" aria-label="Loading">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <button type="submit" className="btn">
          Submit
        </button>
      )}
    </form>
  );
}
