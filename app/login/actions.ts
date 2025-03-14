"use server";

import { ServiceResult } from "@/auth/login/LoginServiceResult";
import { init } from "@/services/setup";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type CreateSessionResponse = {
  errors: string[];
};

export async function createSession(
  prev_state: any,
  form_data: FormData,
): Promise<CreateSessionResponse> {
  const portfolio_service_locator = await init();
  const login_service = portfolio_service_locator.login;
  const password = form_data.get("password");

  if (!password) {
    return {
      errors: [
        "Password required."
      ],
    };
  }

  const auth_service_response = await login_service.login(password.toString());
  if (auth_service_response.code == ServiceResult.INVALID) {
    return {
      errors: ["Invalid password"],
    };
  }

  (await cookies()).set("session", auth_service_response.token, {
    httpOnly: true,
    secure: auth_service_response.secure,
    expires: auth_service_response.expires,
    path: "/",
  });
  redirect("/admin/projects");
}
