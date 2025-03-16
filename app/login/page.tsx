"use client";

import { createSession } from "./actions";
import { useActionState } from "react";
import FormAlert from "@/components/FormAlert";

const initial_form_state = {
  errors: [],
};

export default function Login() {
  const [state, formAction] = useActionState(createSession, initial_form_state);

  return (
    <div className="flex min-h-svh flex-col justify-center gap-4">
      <header className="mx-auto min-w-xs">
        <h1 className="text-2xl">Login Form</h1>
      </header>
      <main className="mx-auto min-w-xs">
        <form className="flex flex-col gap-2" action={formAction}>
          <label htmlFor="PasswordInput" className="label">
            Password
          </label>
          <input
            id="PasswordInput"
            className="input w-full max-w-xs"
            name="password"
            type="password"
            required
          />
          <FormAlert errors={state.errors} />
          <div className="flex justify-end">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
