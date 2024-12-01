'use client'

import { useState } from "react";

type DeleteProjectProps = {
  title: string,
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void
}

export default function DeleteProjectButton({
  title,
  onSubmit
}: DeleteProjectProps) {

  const [dialog_open, setDialogOpen] = useState(false);

  return <>
    <button type="button" onClick={() => setDialogOpen(true)}>Delete {title}</button>
    <dialog open={dialog_open} role="alert">
      Are you sure?
      <form method="dialog" onSubmit={onSubmit}>
        <button type="submit">Yes</button>
      </form>
      <button type="button" onClick={() => setDialogOpen(false)}>Cancel</button>
    </dialog>
  </>
}
