"use client";

import { createSession } from "./commands";
import { useActionState } from "react";
import FormAlert from "@/components/FormAlert";

const initial_form_state = {
  errors: [],
};

export default function Login() {
  const [state, formAction] = useActionState(createSession, initial_form_state);

  return (
    <div className="flex min-h-svh flex-col justify-center">
      <form className="m-auto flex flex-col gap-2" action={formAction}>
        <h1 className="mb-2 text-2xl">Login</h1>
        <label className="form-control">
          <span className="label-text">Password</span>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            name="password"
            required
          />
        </label>
        <FormAlert errors={state.errors} />
        <div className="flex justify-end">
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
