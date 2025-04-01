"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

const ALLOWED_FILE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
];

type MediaInputProps = {
  value_media?: {
    file: File;
    description: string;
  }[];
  value_thumbnail?: string;
};

export default function MediaInput({
  value_media = [],
  value_thumbnail = "",
}: MediaInputProps) {
  const [files, setFiles] = useState<File[]>([]);
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
          required
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
      {files.length > 0 && (
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
    </fieldset>
  );
}
