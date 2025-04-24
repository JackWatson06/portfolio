import { render, screen } from "@testing-library/react";

import MediaInput from "@/app/admin/projects/MediaInput";
import userEvent from "@testing-library/user-event";
import "html-validate/jest";

import "@testing-library/jest-dom";
import { useState } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  useEffect: jest.fn(), // Mocking this because we don't have the DataTransfer API in jsdom.
}));

const useStateMock = useState as jest.Mock;
beforeEach(() => {
  useStateMock.mockReset();
  useStateMock.mockReturnValue([[], jest.fn()]);
});

test("adding a file sets state", async () => {
  const mock_set_files = jest.fn();
  useStateMock.mockReturnValueOnce([[], mock_set_files]);

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
  useStateMock.mockReturnValueOnce([[], mock_set_files]);

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
  useStateMock.mockReturnValueOnce([
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

test("skip setting files when there is not value media input", async () => {
  const mock_set_files = jest.fn();
  useStateMock.mockReturnValueOnce([[], mock_set_files]);

  render(<MediaInput value_media={[]} />);

  expect(mock_set_files).not.toHaveBeenCalled();
});

test("skip setting files when there is not value existing media input", async () => {
  const mock_set_files = jest.fn();
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([[], mock_set_files]);

  render(<MediaInput value_existing_media={[]} />);

  expect(mock_set_files).not.toHaveBeenCalled();
});

test("setting value sets descriptions for files in state", async () => {
  const mock_set_files = jest.fn();
  useStateMock.mockReturnValueOnce([
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
  useStateMock.mockReturnValueOnce([
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
  useStateMock.mockReturnValueOnce([
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
  useStateMock.mockReturnValueOnce([[], mock_set_files]);

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
  useStateMock.mockReturnValueOnce([
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
  useStateMock.mockReturnValueOnce([
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

test("requiring descriptions", async () => {
  useStateMock.mockReturnValueOnce([
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    jest.fn(),
  ]);

  const submit_form_mock = jest.fn();
  const user = userEvent.setup();

  render(
    <form action={submit_form_mock}>
      <MediaInput />
      <button type="submit">submit</button>
    </form>,
  );

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("requiring a thumbnail", async () => {
  useStateMock.mockReturnValueOnce([
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    jest.fn(),
  ]);
  const submit_form_mock = jest.fn();
  const user = userEvent.setup();

  render(
    <form action={submit_form_mock}>
      <MediaInput />
      <button type="submit">submit</button>
    </form>,
  );

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  const description_input = screen.getByRole("textbox", {
    name: /testing\.png description/i,
  });
  await user.type(description_input, "testing");
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("requiring a file", async () => {
  useStateMock.mockReturnValueOnce([
    [
      new File(["testing"], "testing.png", {
        type: "image/png",
      }),
    ],
    jest.fn(),
  ]);
  const submit_form_mock = jest.fn();
  const user = userEvent.setup();

  // Act - By not seeding the media files we never set media input.
  render(
    <form action={submit_form_mock}>
      <MediaInput />
      <button type="submit">submit</button>
    </form>,
  );
  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(submit_form_mock).not.toHaveBeenCalled();
});

test("input has existing media file url", async () => {
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing",
      },
    ],
    jest.fn(),
  ]);

  render(<MediaInput />);

  expect(screen.getByText("https://localhost.com/testing")).toBeInTheDocument();
});

test("input has existing media file mime type", async () => {
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing",
      },
    ],
    jest.fn(),
  ]);

  render(<MediaInput />);

  expect(screen.getByText("image/png")).toBeInTheDocument();
});

test("input has existing media file description", async () => {
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing file description",
      },
    ],
    jest.fn(),
  ]);

  render(<MediaInput />);

  expect(screen.getByText("testing file description")).toBeInTheDocument();
});

test("removing a previous uploaded file", async () => {
  const mock_set_existing_files = jest.fn();
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing file description",
      },
    ],
    mock_set_existing_files,
  ]);
  const user = userEvent.setup();

  render(<MediaInput />);

  const remove_image_button = screen.getByRole("button", {
    name: /remove image\/png/i,
  });
  await user.click(remove_image_button);

  expect(mock_set_existing_files).toHaveBeenCalledWith([]);
});

test("form includes previous uploaded files", async () => {
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValue([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing file description",
      },
    ],
    jest.fn(),
  ]);
  const submit_form_mock = jest.fn();
  const user = userEvent.setup();

  const { container } = render(
    <form action={submit_form_mock}>
      <MediaInput />
      <button type="submit">submit</button>
    </form>,
  );

  const submit_button = screen.getByRole("button", {
    name: /submit/i,
  });
  await user.click(submit_button);

  expect(container.querySelector("form")).toHaveFormValues({
    media_existing_hash: "testing_hash",
  });
});

test("media only required when it does not have existing media", async () => {
  const mock_set_existing_files = jest.fn();
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing file description",
      },
    ],
    mock_set_existing_files,
  ]);

  render(<MediaInput />);

  const upload_media_input = screen.getByLabelText(/upload media/i);

  expect(upload_media_input).not.toHaveAttribute("required");
});

test("files in existing media state create thumbnail field", () => {
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([
    [
      {
        url: "https://localhost.com/testing",
        hash: "testing_hash",
        mime_type: "image/png",
        description: "testing file description",
      },
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

test("removing all existing media makes the media input required", async () => {
  const mock_set_existing_files = jest.fn();
  useStateMock.mockReturnValueOnce([[], jest.fn()]);
  useStateMock.mockReturnValueOnce([[], mock_set_existing_files]);

  render(<MediaInput />);

  const upload_media_input = screen.getByLabelText(/upload media/i);

  expect(upload_media_input).toHaveAttribute("required");
});
