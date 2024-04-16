import Page from "../../app/page";

import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { expect, describe, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

describe("Page", () => {
  test("rendering the heading", async () => {
    render(<Page />);

    const heading = await screen.findAllByText("Get started by editing");

    expect(heading[0]).toBeInTheDocument();
  });
});
