"use client";

import { useFormState } from "react-dom";
import { createSession } from "./SessionCommand";
import LoginAlert from "./LoginAlert";

const initial_form_state = {
  errors: [],
};

export default function Login() {
  const [state, formAction] = useFormState(createSession, initial_form_state);

  return (
    <div className="flex min-h-svh flex-col justify-center">
      <form className="m-auto" action={formAction}>
        <h1>Login</h1>

        <label className="form-control">
          <span className="label-text">Password</span>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            name="password"
            required
          />
        </label>
        <LoginAlert errors={state.errors} />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
