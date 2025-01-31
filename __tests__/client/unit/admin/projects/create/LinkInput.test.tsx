import { logRoles, render, screen } from "@testing-library/react";

import LinkInput from "@/app/admin/projects/create/LinkInput";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";

import "@testing-library/jest-dom";
import { useState } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

beforeEach(() => {
  (useState as jest.Mock).mockImplementation(() => [[], jest.fn()]);
});

test("adding a link sets state", async () => {
  const mock_set_links = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [[], mock_set_links]);
  const user = userEvent.setup();
  const testing_link = "https://testing.com/project";

  render(<LinkInput />);
  const add_link_input = screen.getByRole("textbox", {
    name: /add link/i,
  });
  const add_link_button = screen.getByRole("button", {
    name: /add link/i,
  });
  add_link_input.setAttribute("value", testing_link);
  await user.click(add_link_button);

  expect(mock_set_links).toHaveBeenCalledWith([testing_link]);
});

test("adding multiple links adds multiple links to state", async () => {
  const mock_set_links = jest.fn();
  const testing_one_link = "https://testing.com/project";
  (useState as jest.Mock).mockImplementation(() => [
    [testing_one_link],
    mock_set_links,
  ]);
  const user = userEvent.setup();
  const testing_two_link = "https://testing.com/project_two";

  render(<LinkInput />);
  const add_link_input = screen.getByRole("textbox", {
    name: /add link/i,
  });
  const add_link_button = screen.getByRole("button", {
    name: /add link/i,
  });
  add_link_input.setAttribute("value", testing_two_link);
  await user.click(add_link_button);

  expect(mock_set_links).toHaveBeenCalledWith([
    testing_one_link,
    testing_two_link,
  ]);
});

test("links in state create type fields", () => {
  (useState as jest.Mock).mockImplementation(() => [
    ["https://testing.com/project", "https://testing.com/project_two"],
    jest.fn(),
  ]);

  render(<LinkInput />);

  expect(screen.getAllByLabelText(/link type/i)).toHaveLength(2);
});

test("filtering a duplicate link", async () => {
  const mock_set_links = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [[], mock_set_links]);
  const user = userEvent.setup();
  const testing_one_link = "https://testing.com/project";
  const testing_two_link = "https://testing.com/project";

  render(<LinkInput />);
  const add_link_input = screen.getByRole("textbox", {
    name: /add link/i,
  });
  const add_link_button = screen.getByRole("textbox", {
    name: /add link/i,
  });
  add_link_input.setAttribute("value", testing_one_link);
  await user.click(add_link_button);
  add_link_input.setAttribute("value", testing_two_link);
  await user.click(add_link_button);

  expect(mock_set_links).not.toHaveBeenCalledWith([
    testing_one_link,
    testing_two_link,
  ]);
});

test("listing the link names that were added", () => {
  (useState as jest.Mock).mockImplementation(() => [
    ["https://testing.com/project"],
    jest.fn(),
  ]);

  render(<LinkInput />);

  expect(
    screen.getByText(/https:\/\/testing\.com\/project link type/i),
  ).toBeInTheDocument();
});

test("removing an added link", async () => {
  const testing_one_link = "https://testing.com/project";
  const testing_two_link = "https://testing.com/project_two";
  const mock_set_links = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [
    [testing_one_link, testing_two_link],
    mock_set_links,
  ]);
  const user = userEvent.setup();

  render(<LinkInput />);
  const remove_testing_one_button = screen.getByRole("button", {
    name: /remove https:\/\/testing\.com\/project_two/i,
  });
  await user.click(remove_testing_one_button);

  expect(mock_set_links).toHaveBeenCalledWith([testing_one_link]);
});
