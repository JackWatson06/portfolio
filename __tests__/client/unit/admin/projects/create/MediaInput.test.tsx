import { render, screen } from "@testing-library/react";

import MediaInput from "@/app/admin/projects/create/MediaInput";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";

import "@testing-library/jest-dom";
import { useState } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  useEffect: jest.fn(), // Mocking this because we don't have the DataTransfer API in jsdom.
}));

beforeEach(() => {
  (useState as jest.Mock).mockReset();
});

test("adding a file sets state", async () => {
  const mock_set_files = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [[], mock_set_files]);
  const user = userEvent.setup();
  const testing_file = new File(["testing"], "testing.png", {
    type: "image/png",
  });

  render(<MediaInput />);
  const input = screen.getByLabelText(/upload media/i);
  await user.upload(input, testing_file);

  expect(mock_set_files).toHaveBeenCalledWith([testing_file]);
});

test("adding multiple files adds multiple files to state", async () => {
  const mock_set_files = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [[], mock_set_files]);
  const user = userEvent.setup();
  const testing_one_file = new File(["testing"], "testing.png", {
    type: "image/png",
  });
  const testing_two_file = new File(["testing_two"], "testing_two.jpg", {
    type: "image/jpeg",
  });

  render(<MediaInput />);
  const input = screen.getByLabelText(/upload media/i);
  await user.upload(input, [testing_one_file, testing_two_file]);

  expect(mock_set_files).toHaveBeenCalledWith([
    testing_one_file,
    testing_two_file,
  ]);
});

test("files in state create thumbnail field", () => {
  (useState as jest.Mock).mockImplementation(() => [
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    jest.fn(),
  ]);

  render(<MediaInput />);

  expect(
    screen.queryByRole("textbox", {
      name: /thumbnail/i,
    }),
  ).toBeInTheDocument();
});

test("skip setting files when there is not value", async () => {
  const mock_set_files = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [[], mock_set_files]);

  render(<MediaInput value_media={[]} />);

  expect(mock_set_files).not.toHaveBeenCalled();
});

test("setting value sets descriptions for files in state", async () => {
  const mock_set_files = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    mock_set_files,
  ]);
  const user = userEvent.setup();
  const testing_one_file = new File(["testing"], "testing.png", {
    type: "image/png",
  });

  render(
    <MediaInput
      value_media={[
        {
          file: testing_one_file,
          description: "Testing",
        },
      ]}
    />,
  );
  const input = screen.getByLabelText(/upload media/i);
  await user.upload(input, [testing_one_file]);

  expect(
    screen.queryByRole("textbox", {
      name: /description/i,
    }),
  ).toHaveAttribute("value", "Testing");
});

test("setting value sets thumbnail", async () => {
  (useState as jest.Mock).mockImplementation(() => [
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    jest.fn(),
  ]);

  render(<MediaInput value_thumbnail="testing.png" />);

  expect(
    screen.queryByRole("textbox", {
      name: /thumbnail/i,
    }),
  ).toHaveAttribute("value", "testing.png");
});

test("files in state create description fields", () => {
  (useState as jest.Mock).mockImplementation(() => [
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
      new File(["testing_two"], "testing_two.jpg", {
        type: "image/jpeg",
      }),
    ],
    jest.fn(),
  ]);

  render(<MediaInput />);

  expect(screen.getAllByLabelText(/description/i)).toHaveLength(2);
});

test("filtering a file that is not allowed", async () => {
  const mock_set_files = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [[], mock_set_files]);
  const user = userEvent.setup();
  const testing_one_file = new File(["testing"], "testing.mp3", {
    type: "audio/mpeg",
  });
  const testing_two_file = new File(["testing"], "testing_two.jpg", {
    type: "image/jpeg",
  });

  render(<MediaInput />);
  const input = screen.getByLabelText(/upload media/i);
  await user.upload(input, [testing_one_file, testing_two_file]);

  expect(mock_set_files).toHaveBeenCalledWith([testing_two_file]);
});

test("listing the file names that were uploaded", () => {
  (useState as jest.Mock).mockImplementation(() => [
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    jest.fn(),
  ]);

  render(<MediaInput />);

  expect(screen.getByText(/testing\.png/i)).toBeInTheDocument();
});

test("adding new files clears old files", async () => {
  const mock_set_files = jest.fn();
  (useState as jest.Mock).mockImplementation(() => [
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
      new File(["testing_two"], "testing_two.jpg", {
        type: "image/jpeg",
      }),
    ],
    mock_set_files,
  ]);
  const user = userEvent.setup();
  const testing_file = new File(["testing"], "testing.png", {
    type: "image/png",
  });

  render(<MediaInput />);
  const input = screen.getByLabelText(/upload media/i);
  await user.upload(input, testing_file);

  expect(mock_set_files).toHaveBeenCalledWith([testing_file]);
});
