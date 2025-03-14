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
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-3 text-xl">Link Input</legend>

      <span className="flex flex-row">
        <input
          ref={add_link_input_ref}
          className="input"
          type="text"
          aria-labelledby="AddLinkButton"
        />
        <button
          id="AddLinkButton"
          className="btn"
          onClick={handleAddClick}
          type="button"
        >
          Add Link
        </button>
      </span>
      {link_urls.length > 0 && (
        <>
          <label htmlFor="LiveProjectInput" className="label">
            Live Project Link
          </label>
          <input
            className="input"
            id="LiveProjectInput"
            name="live_project_link"
            type="text"
            defaultValue={value_live_project_link}
          />
        </>
      )}
      {link_urls.length > 0 && <p>Added Link Types:</p>}
      <ul aria-live="polite" className="flex flex-col gap-2">
        {link_urls.map((link, index) => {
          const type_id = `LinkTypeInput${index}`;
          const type_value = findInitialLinkTypeValue(link);

          return (
            <li key={link}>
              <input type="hidden" name="link_url" value={link} />

              <label htmlFor={type_id} className="label text-wrap">
                {link} Link Type
              </label>
              <span className="flex flex-row">
                <select
                  id={type_id}
                  className="select"
                  name="link_type"
                  defaultValue={type_value}
                >
                  <option value="source">Source Code</option>
                  <option value="website">Website</option>
                  <option value="download">Download</option>
                </select>
                <button
                  value={link}
                  onClick={handleRemoveClick}
                  className="btn"
                  type="button"
                >
                  Remove <span className="sr-only">{link}</span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
