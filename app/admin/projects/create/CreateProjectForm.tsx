"use client";

import { useActionState } from "react";
import LinkInput from "./LinkInput";
import MediaInput from "./MediaInput";
import { handleProjectFormAction } from "./actions";
import FormAlert from "@/components/FormAlert";

export default function AdminProjectCreateForm() {
  const [state, handleAction, is_pending] = useActionState(
    handleProjectFormAction,
    {
      errors: [],
    },
  );

  return (
    <form action={handleAction}>
      <FormAlert errors={state.errors} />
      <fieldset>
        <legend>Content</legend>
        <label htmlFor="NameInput">Name</label>
        <input
          className="input input-bordered w-full max-w-xs"
          id="NameInput"
          name="title"
          type="text"
          required
        />
        <label htmlFor="MarkdownDescriptionInput">Markdown Description</label>
        <textarea
          className="input input-bordered w-full max-w-xs"
          id="MarkdownDescriptionInput"
          name="description"
          aria-multiline
          required
        />
        <label htmlFor="TagsInput">Tags</label>
        <span>
          <input
            className="input input-bordered w-full max-w-xs"
            id="TagsInput"
            placeholder="C++, JavaScript, etc..."
            name="tags"
            type="text"
            aria-describedby="TagsInputDescription"
          />
          <span id="TagsInputDescription">Seperate each tag by a comma.</span>
        </span>
        <label htmlFor="VisibilityInput">Visibility</label>
        <select id="VisibilityInput" name="visibility">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </fieldset>

      <fieldset>
        <legend>Media Files</legend>
        <MediaInput />

        <label htmlFor="ThumbnailInput">Thumbnail Image</label>
        <input
          className="input input-bordered w-full max-w-xs"
          id="ThumbnailInput"
          name="thumbnail"
          type="text"
          required
        />
      </fieldset>

      <fieldset>
        <legend>Links</legend>
        <LinkInput />

        <label htmlFor="LiveProjectInput">Live Project Link</label>
        <input
          className="input input-bordered w-full max-w-xs"
          id="LiveProjectInput"
          name="live_project_link"
          type="text"
        />
      </fieldset>
      {is_pending ? (
        <div role="alert" aria-label="Loading">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <button type="submit">Submit</button>
      )}
    </form>
  );
}
