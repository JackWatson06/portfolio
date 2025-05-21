"use client";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { ExistingMediaFormSchema } from "./schemas";

const ALLOWED_FILE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
];

type MediaInputProps = {
  value_existing_media?: ExistingMediaFormSchema[];
  value_media?: {
    file: File;
    description: string;
  }[];
  value_thumbnail?: string;
};

export default function MediaInput({
  value_existing_media = [],
  value_media = [],
  value_thumbnail = "",
}: MediaInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [existing_media, setExistingMedia] =
    useState<ExistingMediaFormSchema[]>(value_existing_media);
  const media_input = useRef<HTMLInputElement | null>(null);

  // Not covered by tests below. We don't have access to the DataTransfer API.
  useEffect(() => {
    if (value_media.length != 0 && media_input.current != null) {
      const data_transfer = new DataTransfer();

      for (const media of value_media) {
        data_transfer.items.add(media.file);
      }

      media_input.current.files = data_transfer.files;
    }
  }, [value_media]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return;
    }
    const new_files = [...e.target.files];

    setFiles(new_files);
  };

  const handleRemoveExistingMediaClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button_target = e.currentTarget;

    if (button_target == null) {
      return;
    }

    const hash = button_target.value;
    setExistingMedia(
      existing_media.filter(
        (existing_media_element) => existing_media_element.hash != hash,
      ),
    );
  };

  const findInitialDescriptionValue = (file_name: string) => {
    const associated_value = value_media.find((media_value_input) => {
      return media_value_input.file.name == file_name;
    });

    if (associated_value == undefined) {
      return "";
    }

    return associated_value.description;
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xl">Media Input</legend>

      <label htmlFor="UploadMediaInput" className="label">
        Upload Media
      </label>
      <span className="flex flex-col">
        <input
          ref={media_input}
          id="UploadMediaInput"
          className="file-input"
          type="file"
          name="media_file"
          required={existing_media.length == 0}
          multiple
          accept={ALLOWED_FILE_MIME_TYPES.join(",")}
          aria-describedby="UploadMediaInputDescription"
          onChange={handleChange}
        />
        <span
          id="UploadMediaInputDescription"
          className="text-sm text-gray-400"
        >
          Upload multiple files.
        </span>
      </span>
      {(files.length > 0 || existing_media.length > 0) && (
        <>
          <label htmlFor="ThumbnailInput" className="label">
            Thumbnail Image
          </label>
          <input
            className="input"
            id="ThumbnailInput"
            name="thumbnail"
            type="text"
            defaultValue={value_thumbnail}
            required
          />
        </>
      )}
      {files.length > 0 && <p>Selected File Descriptions:</p>}
      <ul aria-live="polite" className="flex flex-col gap-2">
        {files.map((file, index) => {
          const id = `MediaDescriptionInput${index}`;
          const description_value = findInitialDescriptionValue(file.name);
          return (
            <li key={file.name}>
              <label htmlFor={id} className="label text-wrap">
                {file.name} Description
              </label>
              <input
                id={id}
                className="input"
                type="text"
                name="media_description"
                defaultValue={description_value}
                required
              />
            </li>
          );
        })}
      </ul>
      {existing_media.length > 0 && <p>Previously Uploaded Media Files:</p>}
      <ul aria-live="polite" className="flex flex-col gap-2">
        {existing_media.map((existing_media_element, index) => {
          const media_file_description_id = `MediaFileDescription${index}`;
          return (
            <li key={existing_media_element.hash}>
              <dl>
                <dt>File URL:</dt>
                <dd>{existing_media_element.url}</dd>

                <dt>Type:</dt>
                <dd>{existing_media_element.mime_type}</dd>

                <dt>Description:</dt>
                <dd id={media_file_description_id}>
                  {existing_media_element.description}
                </dd>
              </dl>
              <input
                type="hidden"
                name="media_existing_hash"
                value={existing_media_element.hash}
              />
              <button
                value={existing_media_element.hash}
                onClick={handleRemoveExistingMediaClick}
                aria-describedby={media_file_description_id}
                className="btn"
                type="button"
              >
                Remove
                <span className="sr-only">
                  {existing_media_element.mime_type} File
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
