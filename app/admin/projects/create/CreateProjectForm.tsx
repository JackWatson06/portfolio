"use client";

import { ProjectFormState, useProjectFormActionState } from "./hooks";
import LinkInput from "./LinkInput";
import MediaInput from "./MediaInput";
import FormAlert from "@/components/FormAlert";

const DEFAULT_FORM_STATE: ProjectFormState = {
  data: {
    name: "",
    description: "",
    tags: "",
    visibility: "private",
    media: [],
    thumbnail: "",
    links: [],
    live_project_link: "",
  },
  errors: [],
};

export default function AdminProjectCreateForm() {
  const [state, handleAction, is_pending] =
    useProjectFormActionState(DEFAULT_FORM_STATE);

  return (
    <form action={handleAction} className="flex max-w-xs flex-col gap-10">
      <FormAlert errors={state.errors} />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-3 text-xl">Content</legend>
        <label htmlFor="NameInput" className="label">
          Name
        </label>
        <input
          className="input"
          id="NameInput"
          name="name"
          type="text"
          required
          defaultValue={state.data.name}
        />
        <label htmlFor="MarkdownDescriptionInput" className="label">
          Markdown Description
        </label>
        <textarea
          className="textarea textarea-md h-24"
          id="MarkdownDescriptionInput"
          name="description"
          aria-multiline
          required
          defaultValue={state.data.description}
        />
        <label htmlFor="TagsInput" className="label">
          Tags
        </label>
        <span className="flex flex-col">
          <input
            className="input"
            id="TagsInput"
            placeholder="C++, JavaScript, etc..."
            name="tags"
            type="text"
            aria-describedby="TagsInputDescription"
            defaultValue={state.data.tags}
          />
          <span id="TagsInputDescription" className="text-sm text-gray-400">
            Seperate each tag by a comma.
          </span>
        </span>
        <label htmlFor="VisibilityInput" className="label">
          Visibility
        </label>
        <select
          className="select"
          id="VisibilityInput"
          name="visibility"
          defaultValue={state.data.visibility}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </fieldset>

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
