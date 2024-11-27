import { createSession } from "@/app/login/SessionCommand";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function mockCookiesFactory() {
  const cookies_constructor_return = {
    set: jest.fn(),
  };

  const cookies_constructor = jest.fn();
  cookies_constructor.mockReturnValue(cookies_constructor_return);

  return {
    cookies: cookies_constructor,
  };
}

function mockRedirectFactory() {
  return {
    redirect: jest.fn(),
  };
}

jest.mock("next/headers", mockCookiesFactory);
jest.mock("next/navigation", mockRedirectFactory);
jest.mock("@/services/setup");

const redirect_mock = redirect as unknown as jest.Mock;
const cookie_mock = cookies as jest.Mock;

test("we set a session for logging in the user.", async () => {
  const cookies_set_mock = jest.fn();
  const cookies_mock = {
    set: cookies_set_mock,
  };
  cookie_mock.mockReturnValue(cookies_mock);
  const form_data = new FormData();
  form_data.append("password", "testing");

  await createSession({}, form_data);

  expect(cookies_set_mock.mock.calls[0][1]).toBe("testing");
});

test("we redirect the user after logging them into the site.", async () => {
  const form_data = new FormData();
  form_data.append("password", "testing");

  await createSession({}, form_data);

  expect(redirect_mock.mock.calls[0][0]).toBe("/admin/projects");
});

test("we return an error with an invalid password.", async () => {
  const form_data = new FormData();
  form_data.append("password", "testing_invalid");

  const response = await createSession({}, form_data);

  expect(response.errors.length).toBe(1);
});

test("we return an error with an invalid form.", async () => {
  const form_data = new FormData();
  form_data.append("invalid", "testing_invalid");

  const response = await createSession({}, form_data);

  expect(response.errors.length).toBe(1);
});

test("we get error when the service locator does not get initialized.", async () => {
  jest.mock("@/services/setup", () => ({
    portfolio_service_locator: null,
  }));

  const response = await createSession({}, new FormData());

  expect(response.errors.length).toBe(1);
});

test("we set expected JWT cookie options.", async () => {
  const cookies_set_mock = jest.fn();
  const cookies_mock = {
    set: cookies_set_mock,
  };
  cookie_mock.mockReturnValue(cookies_mock);
  const form_data = new FormData();
  form_data.append("password", "testing");

  await createSession({}, form_data);

  expect(cookies_set_mock.mock.calls[0][2]).toEqual({
    httpOnly: true,
    secure: false,
    expires: 10_000,
    path: "/",
  });
});
