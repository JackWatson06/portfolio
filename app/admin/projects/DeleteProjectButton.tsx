"use client";

import { useState } from "react";

type DeleteProjectProps = {
  title: string;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export default function DeleteProjectButton({
  title,
  onSubmit,
}: DeleteProjectProps) {
  const [dialog_open, setDialogOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => setDialogOpen(true)}
      >
        Delete {title}
      </button>
      <dialog open={dialog_open} role="alert" className="modal">
        <div className="modal-box">
          <h4>Are you sure?</h4>
          <div className="modal-action">
            <form method="dialog" onSubmit={onSubmit}>
              <button className="btn" type="submit">
                Yes
              </button>
            </form>
            <button
              className="btn"
              type="button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
