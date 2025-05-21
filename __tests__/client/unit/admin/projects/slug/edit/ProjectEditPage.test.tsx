import EditProject from "@/app/admin/projects/[slug]/edit/page";
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import "html-validate/jest";
import { axe, toHaveNoViolations } from "jest-axe";
import { screen } from "@testing-library/react";
import { TEST_PROJECT_EDIT_FORM_STATE } from "@/__tests__/seeding/projects/ProjectViewData";
import { fetchProjectBySlug } from "@/app/admin/projects/[slug]/edit/queries";

expect.extend(toHaveNoViolations);

jest.mock("@/services/setup");
jest.mock("@/app/admin/projects/[slug]/edit/queries", () => ({
  fetchProjectBySlug: jest.fn(() => TEST_PROJECT_EDIT_FORM_STATE),
}));
jest.mock("@/app/admin/projects/actions", () => ({
  projectUpdateAction: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

test("admin project create page renders valid HTML.", async () => {
  const { container } = render(
    await EditProject({
      params: new Promise((resolve) => resolve({ slug: "testing" })),
    }),
  );

  expect(container.innerHTML).toHTMLValidate();
});

test("accessability of page.", async () => {
  const { container } = render(
    await EditProject({
      params: new Promise((resolve) => resolve({ slug: "testing" })),
    }),
  );

  await act(async () => {
    expect(await axe(container)).toHaveNoViolations();
  });
});

test("page contains project title", async () => {
  render(
    await EditProject({
      params: new Promise((resolve) => resolve({ slug: "testing" })),
    }),
  );

  expect(
    screen.queryByRole("heading", {
      name: /gandalf/i,
      level: 1,
    }),
  ).toBeInTheDocument();
});

test("page shows missing message when slug fetch returns null", async () => {
  (fetchProjectBySlug as jest.Mock).mockReturnValueOnce(null);

  render(
    await EditProject({
      params: new Promise((resolve) => resolve({ slug: "testing" })),
    }),
  );

  expect(
    screen.queryByRole("heading", {
      name: /find/i,
      level: 1,
    }),
  ).toBeInTheDocument();
});
