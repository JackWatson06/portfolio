"use server";

import { ScriptResult } from "@/auth/TransactionScriptResult";
import { init, portfolio_service_locator } from "@/services/setup";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

type Response = {
  errors: string[];
};

export async function createSession(
  prev_state: any,
  form_data: FormData,
): Promise<Response> {
  await init();
  if (portfolio_service_locator == null) {
    return {
      errors: ["Server error. Try again later."],
    };
  }

  const auth_service = portfolio_service_locator.auth;

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

  const auth_service_response = await auth_service.login(result.data.password);
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
