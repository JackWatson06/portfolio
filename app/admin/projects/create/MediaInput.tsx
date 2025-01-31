"use client";

import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";

const ALLOWED_FILE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
];
export default function MediaInput() {
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return;
    }

    const new_files = [...e.target.files];

    setFiles(new_files);
  };

  return (
    <fieldset>
      <legend>Media Input</legend>

      <label htmlFor="UploadMediaInput">Upload Media</label>
      <span>
        <input
          id="UploadMediaInput"
          type="file"
          multiple
          accept={ALLOWED_FILE_MIME_TYPES.join(",")}
          aria-describedby="UploadMediaInputDescription"
          onChange={handleChange}
        />
        <span id="UploadMediaInputDescription">Upload multiple files.</span>
      </span>
      <ul aria-live="polite">
        {files.map((file) => {
          const id = `${file.name}DescriptionInput`;
          const name = `${file.name}_description`;
          return (
            <li key={file.name}>
              <label htmlFor={id}>{file.name} Description</label>
              <input id={id} type="text" name={name} />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
