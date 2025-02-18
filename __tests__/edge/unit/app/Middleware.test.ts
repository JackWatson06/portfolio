import { middleware } from "@/middleware"; // Middleware
import { init, free, environment } from "@/services/edge-setup"; // This will be the mocked module.
import { NextRequest } from "next/server";

jest.mock("@/services/edge-setup"); // Hoisted up to the top. Then it mocks the require output
// with the module output from __mock__.
// beforeEach(() => {
// });

test("allowing requests when accessing non admin pages", async () => {
  const request = new NextRequest("http://testing.com/p");

  const response = await middleware(request);

  expect(response.status).toBe(200);
});

test("allowing request when we have a valid JWT session.", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");
  request.cookies.set("session", "testing");

  const response = await middleware(request);

  expect(response.status).toBe(200);
});

it.each([["gandalf"], ["bilbo"], ["frodo"]])(
  "using the domain origin for the redirect location. Test case: %s",
  async (origin: string) => {
    const request = new NextRequest(`http://${origin}.com/admin/projects`);

    const response = await middleware(request);

    expect(response.headers.get("location")).toBe(`http://${origin}.com/login`);
  },
);

test("redirecting request to login when accessing an admin page without a session", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");

  const response = await middleware(request);

  expect(response.headers.get("location")).toBe("http://testing.com/login");
});

test("redirect request when accessing an admin page with an invalid JWT session", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");
  request.cookies.set("session", "hello");

  const response = await middleware(request);

  expect(response.headers.get("location")).toBe("http://testing.com/login");
});

test("validating the session against the token service", async () => {
  const request = new NextRequest("http://testing.com/admin/projects");
  request.cookies.set("session", "hello");

  await middleware(request);

  const service_locator = init();
  const mock_validate = service_locator.token.validate as jest.Mock;
  expect(mock_validate).toHaveBeenCalled();
});

test("returning 401 when accessing API unauthenticated", async () => {
  const request = new NextRequest("http://testing.com/api/media");

  const response = await middleware(request);

  expect(response.status).toBe(401);
});

test("returning 501 when accessing API on production", async () => {
  const previous_environment = environment;
  jest.resetModules();
  jest.doMock("@/services/edge-setup", () => ({
    init: init,
    free: free,
    environment: "production",
  }));
  const middleware_module = await import("@/middleware");
  const request = new NextRequest("http://testing.com/api/media");

  const response = await middleware_module.middleware(request);

  expect(response.status).toBe(501);
  jest.resetModules();
  jest.doMock("@/services/edge-setup", () => ({
    init: init,
    free: free,
    environment: previous_environment,
  }));
});
