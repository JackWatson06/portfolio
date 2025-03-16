"use client";

import { MouseEvent, useRef, useState } from "react";

type Link = {
  url: string;
  type: string;
};

type LinkInputProps = {
  value_links?: Link[];
  value_live_project_link?: string;
};

// Pass in the existing links and their associated types.
export default function LinkInput({
  value_links = [],
  value_live_project_link = "",
}: LinkInputProps) {
  const add_link_input_ref = useRef<HTMLInputElement>(null);
  const [link_urls, setLinkUrls] = useState<string[]>(
    value_links.map((link) => link.url),
  );

  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (
      add_link_input_ref == null ||
      add_link_input_ref.current == null ||
      add_link_input_ref.current.value == "" ||
      link_urls.includes(add_link_input_ref.current.value)
    ) {
      return;
    }

    setLinkUrls([...link_urls, add_link_input_ref.current.value]);
  };

  const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
    const remove_url = e.currentTarget.getAttribute("value");

    if (remove_url == null) {
      return;
    }

    setLinkUrls([...link_urls].filter((link) => link != remove_url));
  };

  const findInitialLinkTypeValue = (url: string) => {
    const associated_value = value_links.find((link_input_value) => {
      return link_input_value.url == url;
    });

    if (associated_value == undefined) {
      return "source";
    }

    return associated_value.type;
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
        {link_urls.map((link, index) => {
          const type_id = `LinkTypeInput${index}`;
          const type_value = findInitialLinkTypeValue(link);

          return (
            <li key={link}>
              <input type="hidden" name="link_url" value={link} />

              <label htmlFor={type_id}>{link} Link Type</label>
              <select id={type_id} name="link_type" defaultValue={type_value}>
                <option value="source">Source Code</option>
                <option value="website">Website</option>
                <option value="download">Download</option>
              </select>
              <button value={link} onClick={handleRemoveClick} type="button">
                Remove <span className="sr-only">{link}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {link_urls.length > 0 && (
        <>
          <label htmlFor="LiveProjectInput">Live Project Link</label>
          <input
            className="input input-bordered w-full max-w-xs"
            id="LiveProjectInput"
            name="live_project_link"
            type="text"
            defaultValue={value_live_project_link}
          />
        </>
      )}
    </fieldset>
  );
}
