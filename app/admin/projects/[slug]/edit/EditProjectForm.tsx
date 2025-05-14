"use client";

import FormAlert from "@/components/FormAlert";
import { ProjectFormState } from "../../schemas";
import { useProjectEditFormActionState } from "../../hooks";
import ProjectMetadataInput from "../../ProjectMetadataInput";
import MediaInput from "../../MediaInput";
import LinkInput from "../../LinkInput";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useEffect } from "react";

type EditProjectFormProps = {
  form_state: ProjectFormState;
};

export default function EditProjectForm({ form_state }: EditProjectFormProps) {
  const [state, handleAction, is_pending] =
    useProjectEditFormActionState(form_state);
  const router = useRouter();

  useEffect(() => {
    if (form_state.slug != state.slug) {
      router.push(`/admin/projects/${state.slug}/edit`);
    }
  }, [form_state, state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      handleAction(new FormData(event.currentTarget));
    });
  };

  return (
    // onSubmit here because actions resets form state... this is wild: https://github.com/facebook/react/issues/29034
    <form onSubmit={handleSubmit} className="flex max-w-xs flex-col gap-10">
      <FormAlert errors={state.errors} />

      <ProjectMetadataInput
        value_name={state.data.name}
        value_description={state.data.description}
        value_tags={state.data.tags}
        value_visibility={state.data.visibility}
      />
      <MediaInput
        value_existing_media={state.data.existing_media}
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
