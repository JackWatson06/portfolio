"use client";

type ProejctMetadataInputParams = {
  value_name: string;
  value_description: string;
  value_tags: string;
  value_visibility: string;
};

export default function ProjectMetadataInput({
  value_name,
  value_description,
  value_tags,
  value_visibility,
}: ProejctMetadataInputParams) {
  return (
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
        defaultValue={value_name}
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
        defaultValue={value_description}
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
          defaultValue={value_tags}
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
        defaultValue={value_visibility}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </fieldset>
  );
}
