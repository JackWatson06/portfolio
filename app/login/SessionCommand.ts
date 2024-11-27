"use server";

import { ScriptResult } from "@/auth/login/TransactionScriptResult";
import { init } from "@/services/setup";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export type CreateSessionResponse = {
  errors: string[];
};

export async function createSession(
  prev_state: any,
  form_data: FormData,
): Promise<CreateSessionResponse> {
  const portfolio_service_locator = await init();
  if (portfolio_service_locator == null) {
    return {
      errors: ["Server error. Try again later."],
    };
  }

  const login_service = portfolio_service_locator.login;

  const form_schema = z.object({
    password: z.string({ message: "Password required." }),
  });

  const result = form_schema.safeParse(Object.fromEntries(form_data.entries()));

  if (!result.success) {
    return {
      errors: result.error.errors.map((zod_error) => {
        return zod_error.message;
      }),
    };
  }

  const auth_service_response = await login_service.login(result.data.password);
  if (auth_service_response.code == ScriptResult.INVALID) {
    return {
      errors: ["Invalid password"],
    };
  }

  cookies().set("session", auth_service_response.token, {
    httpOnly: true,
    secure: auth_service_response.secure,
    expires: auth_service_response.expires,
    path: "/",
  });
  redirect("/admin/projects");
}
