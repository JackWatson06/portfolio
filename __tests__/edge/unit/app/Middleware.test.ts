import { middleware } from "@/middleware";
import { init } from "@/services/edge-setup";
import { NextRequest } from "next/server";

jest.mock("@/services/edge-setup");

test("we are redirected to login when accessing admin pages unauthenticated.", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");

  const response = await middleware(request);

  expect(response.headers.get("location")).toBe("http://testing.com/login");
});

test("we are not redirected to login when accessing non admin pages.", async () => {
  const request = new NextRequest("http://testing.com/p");

  const response = await middleware(request);

  expect(response.status).toBe(200);
});

it.each([["gandalf"], ["bilbo"], ["frodo"]])(
  "we use the domain origin for the redirect location. Test case: %s",
  async (origin: string) => {
    const request = new NextRequest(`http://${origin}.com/admin/projects`);

    const response = await middleware(request);

    expect(response.headers.get("location")).toBe(`http://${origin}.com/login`);
  },
);

test("we are redirected when accessing an admin page without a session.", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");

  const response = await middleware(request);

  expect(response.headers.get("location")).toBe("http://testing.com/login");
});

test("we are not redirected when we have a valid JWT session.", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");
  request.cookies.set("session", "testing");

  const response = await middleware(request);

  expect(response.status).toBe(200);
});

test("we are redirected when accessing an admin page with an invalid JWT session.", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");
  request.cookies.set("session", "hello");

  const response = await middleware(request);

  expect(response.headers.get("location")).toBe("http://testing.com/login");
});

test("we validate the session against the token service.", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");
  request.cookies.set("session", "hello");

  await middleware(request);

  const service_locator = init();
  const mock_validate = service_locator.token.validate as jest.Mock;
  expect(mock_validate).toHaveBeenCalled();
});
