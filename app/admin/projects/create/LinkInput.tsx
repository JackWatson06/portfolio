"use client";

import { MouseEvent, useRef, useState } from "react";

export default function LinkInput() {
  const add_link_input_ref = useRef<HTMLInputElement>(null);
  const [links, setLinks] = useState<string[]>([]);

  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (
      add_link_input_ref == null ||
      add_link_input_ref.current == null ||
      links.includes(add_link_input_ref.current.value)
    ) {
      return;
    }

    setLinks([...links, add_link_input_ref.current.value]);
  };

  const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
    const remove_link = e.currentTarget.getAttribute("value");

    if (remove_link == null) {
      return;
    }

    setLinks([...links].filter((link) => link != remove_link));
  };

  return (
    <fieldset>
      <legend>Link Input</legend>

      <input
        ref={add_link_input_ref}
        type="text"
        aria-labelledby="AddLinkButton"
      />
      <button id="AddLinkButton" onClick={handleAddClick} type="button">
        Add Link
      </button>
      <ul aria-live="polite">
        {links.map((link) => {
          const id = `${link}DescriptionInput`;
          const name = `${link}_type`;
          return (
            <li key={link}>
              <label htmlFor={id}>{link} Link Type</label>
              <select id={id} name={name}>
                <option value="source">Source Code</option>
                <option value="website">WebsiEte</option>
                <option value="download">Download</option>
              </select>
              <button value={link} onClick={handleRemoveClick} type="button">
                Remove <span className="sr-only">{link}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
