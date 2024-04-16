import { GET } from "@/app/api/v1/projects/route";

import { describe, test } from "@jest/globals";

describe("Projects", () => {
  test("we can get all projects.", async () => {
    const body = {
      feedback: "Testing",
    };

    const headers = {
      "Content-Type": "application/json",
      "accept-language": "en-US",
    };

    const params: RequestInit = {
      headers: headers,
      method: "POST",
      body: JSON.stringify(body),
    };

    const response = await GET(new Request("http://doesntmatter", params));

    const response_body = await response.json();
    expect(response.status).toBe(200);
    expect(response_body).toEqual({ testing: {} });
  });
});
