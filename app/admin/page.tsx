"use client"

import { useFormState } from "react-dom";
import { createSession } from "./SessionCommand";

const initial_form_state = {
  errors: []
}

export default async function Login() {
  const [state, formAction] = useFormState(createSession, initial_form_state)
 
  return <form action={formAction}>
    <label htmlFor="password">Password</label>
    <input type="password" name="password" required />
    <p aria-live="polite">{state?.errors.join(",")}</p>
    <button type="submit">Login</button>
  </form>
}
