import { TEST_PROJECT_ONE } from "@/__tests__/seeding/projects/ProjectData";
import { TEST_PROJECT_EDIT_FORM_STATE } from "@/__tests__/seeding/projects/ProjectViewData";
import {
  projectCreateAction,
  fetchBlobUploadParameters,
  fetchProjectWithName,
  projectUpdateAction,
} from "@/app/admin/projects/actions";
import {
  useProjectCreateFormActionState,
  useProjectEditFormActionState,
} from "@/app/admin/projects/hooks";
import {
  ProjectFormSchema,
  ProjectFormState,
} from "@/app/admin/projects/schemas";
import { ProjectCreate } from "@/projects/DTOSchema";
import { useActionState } from "react";

/* -------------------------------------------------------------------------- */
/*                                  Test Data                                 */
/* -------------------------------------------------------------------------- */

global.fetch = jest.fn();
const mock_push: jest.Mock = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));
jest.mock("@/app/admin/projects/libs", () => ({
  sha1HashBlob: jest.fn().mockReturnValue("testing_sha1_hash"),
}));
jest.mock("@/app/admin/projects/actions", () => ({
  projectCreateAction: jest.fn(),
  fetchBlobUploadParameters: jest.fn().mockReturnValue({
    upload: {
      url: "https://testing.com",
      method: "POST",
      headers: {
        Testing: "testing",
      },
    },
    public_url: "https://testing.com",
  }),
  fetchProjectWithName: jest.fn().mockReturnValue(null),
  projectUpdateAction: jest.fn(),
}));

const TEST_DEFAULT_FILE_ONE = new File(["testing_b"], "testing_b.png", {
  type: "image/png",
});
const TEST_DEFAULT_FILE_TWO = new File(["testing_a"], "testing_a.jpg", {
  type: "image/jpeg",
});

const TEST_DEFAULT_CREATE_FORM_STATE: ProjectFormState = {
  data: {
    name: "testing",
    description: "testing",
    tags: "testing_one, testing_two, testing_three",
    visibility: "private",
    media: [
      { file: TEST_DEFAULT_FILE_ONE, description: "testing_b" },
      { file: TEST_DEFAULT_FILE_TWO, description: "testing_a" },
    ],
    existing_media: [],
    thumbnail: "testing_a.jpg",
    links: [
      { url: "https://localhost.com", type: "source" },
      { url: "https://localhost.com/testing", type: "website" },
    ],
    live_project_link: "https://localhost.com/testing",
  },
  slug: "testing",
  errors: [],
};

const TEST_PROJECT_CREATE_INPUT: ProjectCreate = {
  name: "testing",
  description: "testing",
  tags: ["C++", "TypeScript", "Jest"],
  private: true,
  media: [
    {
      mime_type: "image/jpeg",
      url: "https://testing.com",
      hash: "testing_sha1_hash",
      description: "testing_a",
    },
    {
      mime_type: "image/png",
      url: "https://testing.com",
      hash: "testing_sha1_hash",
      description: "testing_b",
    },
  ],
  thumbnail_media: {
    url: "https://testing.com",
    description: "testing_b",
  },
  links: [
    { url: "https://localhost.com", type: "source" },
    { url: "https://localhost.com/testing", type: "website" },
  ],
  live_project_link: "https://localhost.com/testing",
};

function setUpCreateFormData(): FormData {
  const form_data = new FormData();

  form_data.set("name", "testing");
  form_data.set("description", "testing");
  form_data.set("tags", "C++, TypeScript, Jest");
  form_data.set("visibility", "private");

  // Media
  form_data.append("media_file", TEST_DEFAULT_FILE_ONE);
  form_data.append("media_file", TEST_DEFAULT_FILE_TWO);
  form_data.append("media_description", "testing_b");
  form_data.append("media_description", "testing_a");
  form_data.set("thumbnail", "testing_b.png");

  // Links
  form_data.append("link_url", "https://localhost.com");
  form_data.append("link_type", "source");
  form_data.append("link_url", "https://localhost.com/testing");
  form_data.append("link_type", "website");
  form_data.set("live_project_link", "https://localhost.com/testing");

  return form_data;
}

function mockUseActionState(): Promise<ProjectFormState> {
  // Create a promise which get's resolved when we call the internal anonymous function that get's
  // passed to the useActionState handler. Essentially what we do here is we mock the useActionState
  // hook with our own implementation that will call the function that get's passed into the hook
  // inside the useProjectCreateFormActionState / useProjectEditFormActionState. This allows us to
  // return the internal promise of the anonymous callback wrapped in the higher level function.
  // A little janky and requires you to stare at it for a little to understand what's happening.
  // Await this response to get the value of the called anonymous callback passed to useActionState.

  // action_promise = mockUseActionState() which mocks useActionState
  // callback =  useProjectCreateFormActionState() which calls useActionState() which returns (form_data)()
  // callback() then calls handleFormUploadAction(prev_state, form_data) whcih resolves action_promise

  return new Promise((resolve) => {
    (useActionState as jest.Mock).mockImplementation(
      (
        action: (
          prev_state: ProjectFormState,
          form_data: FormData,
        ) => Promise<ProjectFormState>,
        initial_state: ProjectFormState,
      ) => {
        return [
          initial_state,
          (form_data: FormData) => {
            resolve(action(initial_state, form_data)); // resolve will resolve the action() call
            // promise
          },
        ];
      },
    );
  });
}

beforeEach(() => {
  (global.fetch as jest.Mock).mockReturnValue({
    status: 200,
  });
  (projectCreateAction as jest.Mock).mockReset();
  (projectCreateAction as jest.Mock).mockReturnValue({
    code: "SUCCESS",
  });
  (projectUpdateAction as jest.Mock).mockReset();
  mock_push.mockReset();
  (projectUpdateAction as jest.Mock).mockReturnValue({
    code: "SUCCESS",
    slug: "testing",
  });
});

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */

/* --------------------- useProjectCreateFormActionState -------------------- */
test("reseting errors when uploading form", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState({
    ...TEST_DEFAULT_CREATE_FORM_STATE,
    errors: ["testing"],
  });
  const form_data = setUpCreateFormData();

  handleAction(form_data);

  expect((await returned_action_promise).errors).toHaveLength(0);
});

test("error while uploading a form with descriptions length not matching files", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();
  form_data.append("media_description", "testing");

  handleAction(form_data);

  const regex = /length/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("error while uploading a form with links length not matching types", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();
  form_data.append("link_url", "testing");

  handleAction(form_data);

  const regex = /length/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test.each([
  ["name", "testing", (response: ProjectFormSchema) => response.name],
  [
    "description",
    "testing",
    (response: ProjectFormSchema) => response.description,
  ],
  [
    "tags",
    "testing_one, testing_two, testing_three",
    (response: ProjectFormSchema) => response.tags,
  ],
  [
    "visibility",
    "private",
    (response: ProjectFormSchema) => response.visibility,
  ],
  [
    "thumbnail",
    "testing_a.jpg",
    (response: ProjectFormSchema) => response.thumbnail,
  ],
])(
  "defaulting %s attribute to previous state when missing",
  async (attribute, prev_value, get_callback) => {
    const returned_errors_promise = mockUseActionState();
    const [errors, handleAction] = useProjectCreateFormActionState(
      TEST_DEFAULT_CREATE_FORM_STATE,
    );
    const form_data = setUpCreateFormData();
    form_data.delete(attribute);

    handleAction(form_data);

    const action_response = await returned_errors_promise;
    expect(get_callback(action_response.data)).toBe(prev_value);
  },
);

const TEST_NEW_FILE = new File(["testing_new"], "testing_new.png", {
  type: "image/png",
});
function setCreateNewMedia(fd: FormData) {
  fd.delete("media_file");
  fd.delete("media_description");

  fd.append("media_file", TEST_NEW_FILE);
  fd.append("media_description", "testing_new_description");

  fd.set("thumbnail", "testing_new.png");
}

function setCreateNewLinks(fd: FormData) {
  fd.delete("link_url");
  fd.delete("link_type");

  fd.append("link_url", "https://testing_new.com");
  fd.append("link_type", "source");
  fd.set("live_project_link", "");
}

test.each([
  [
    "name",
    "testing_new",
    (fd: FormData) => fd.set("name", "testing_new"),
    (r: ProjectFormSchema) => r.name,
  ],
  [
    "description",
    "testing_new",
    (fd: FormData) => fd.set("description", "testing_new"),
    (r: ProjectFormSchema) => r.description,
  ],
  [
    "tags",
    "testing_new",
    (fd: FormData) => fd.set("tags", "testing_new"),
    (r: ProjectFormSchema) => r.tags,
  ],
  [
    "visibility",
    "public",
    (fd: FormData) => fd.set("visibility", "public"),
    (r: ProjectFormSchema) => r.visibility,
  ],
  [
    "media",
    [{ file: TEST_NEW_FILE, description: "testing_new_description" }],
    setCreateNewMedia,
    (r: ProjectFormSchema) => r.media,
  ],
  [
    "thumbnail",
    "testing_a.jpg",
    (fd: FormData) => fd.set("thumbnail", "testing_a.jpg"),
    (r: ProjectFormSchema) => r.thumbnail,
  ],
  [
    "links",
    [{ url: "https://testing_new.com", type: "source" }],
    setCreateNewLinks,
    (r: ProjectFormSchema) => r.links,
  ],
  [
    "live_project_link",
    "https://testing.com/project",
    (fd: FormData) =>
      fd.set("live_project_link", "https://testing.com/project"),
    (r: ProjectFormSchema) => r.live_project_link,
  ],
])(
  "updating form state with the new value for field %s",
  async (attribute, new_value, set_callback, get_callback) => {
    // attribute used for the test string.
    const returned_errors_promise = mockUseActionState();
    const [errors, handleAction] = useProjectCreateFormActionState(
      TEST_DEFAULT_CREATE_FORM_STATE,
    );
    const form_data = setUpCreateFormData();
    set_callback(form_data);

    handleAction(form_data);

    const action_response = await returned_errors_promise;
    expect(get_callback(action_response.data)).toEqual(new_value);
  },
);

test("filtering empty media files", async () => {
  const returned_errors_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  const test_null_file = new File([], "", {
    type: "application/octet-stream",
  });
  const test_empty_name = new File(["testing"], "", {
    type: "text/plain",
  });
  const test_empty_size = new File([""], "testing.txt", {
    type: "text/plain",
  });
  const test_null_mime_type = new File(["testing"], "testing.txt", {
    type: "application/octet-stream",
  });

  form_data.append("media_file", test_null_file); // We should only be filtering this file.

  form_data.append("media_file", test_empty_name);
  form_data.append("media_description", "testing");

  form_data.append("media_file", test_empty_size);
  form_data.append("media_description", "testing");

  form_data.append("media_file", test_null_mime_type);
  form_data.append("media_description", "testing");

  handleAction(form_data);

  const action_response = await returned_errors_promise;
  expect(action_response.errors.length).toEqual(0);
});

test("validating thumbnail is media element", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();
  form_data.set("thumbnail", "testing.png");

  handleAction(form_data);

  const regex = /thumbnail/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("validating primary link exists in links", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();
  form_data.set("live_project_link", "https://does_not_exist.com");

  handleAction(form_data);

  const regex = /live project link/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("validating slug does not exist", async () => {
  (fetchProjectWithName as jest.Mock).mockReturnValueOnce(TEST_PROJECT_ONE);
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);

  const regex = /slug/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("uploading file with the correct parameters", async () => {
  (fetch as jest.Mock).mockReset();
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);
  await returned_action_promise;

  expect(fetch as jest.Mock).toHaveBeenCalledWith("https://testing.com", {
    method: "POST",
    body: new File(["testing_one"], "testing_one.png", {
      type: "image/png",
    }),
    headers: {
      Testing: "testing",
      "Content-Length": "9",
      "Content-Type": "image/png",
    },
  });
});

test("uploading file returns error when we can't find the upload parameters", async () => {
  (fetchBlobUploadParameters as jest.Mock).mockReturnValueOnce(null);
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);

  const regex = /upload/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("uploading file returns error when the fetch fails", async () => {
  (fetch as jest.Mock).mockImplementationOnce(() => {
    throw Error("testing");
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);

  const regex = /upload/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("uploading file returns error when fetch has error code higher than 300", async () => {
  (fetch as jest.Mock).mockReturnValueOnce({
    status: 300,
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);

  const regex = /upload/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("transforming form input before creating", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);
  await returned_action_promise;

  expect(projectCreateAction as jest.Mock).toHaveBeenCalledWith(
    TEST_PROJECT_CREATE_INPUT,
  );
});

test("transforming form input sets live_project_link to undefined if empty", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  form_data.set("live_project_link", "");

  handleAction(form_data);
  await returned_action_promise;

  const expected_project_create_input = {
    ...TEST_PROJECT_CREATE_INPUT,
  };
  delete expected_project_create_input.live_project_link;
  expect(projectCreateAction as jest.Mock).toHaveBeenCalledWith(
    expected_project_create_input,
  );
});

test("creating the project errors on server error", async () => {
  (projectCreateAction as jest.Mock).mockReturnValue({
    code: "ERROR",
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectCreateFormActionState(
    TEST_DEFAULT_CREATE_FORM_STATE,
  );
  const form_data = setUpCreateFormData();

  handleAction(form_data);

  const regex = /server/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

/* ---------------------- useProjectEditFormActionState --------------------- */
function setUpEditFormData(): FormData {
  const form_data = new FormData();

  form_data.set("name", TEST_PROJECT_EDIT_FORM_STATE.data.name);
  form_data.set("description", TEST_PROJECT_EDIT_FORM_STATE.data.description);
  form_data.set("tags", TEST_PROJECT_EDIT_FORM_STATE.data.tags);
  form_data.set("visibility", TEST_PROJECT_EDIT_FORM_STATE.data.visibility);

  // Media
  for (const existing_media_element of TEST_PROJECT_EDIT_FORM_STATE.data
    .existing_media) {
    form_data.append("media_existing_hash", existing_media_element.hash);
  }
  form_data.set("thumbnail", TEST_PROJECT_EDIT_FORM_STATE.data.thumbnail);

  // Link
  for (const existing_link of TEST_PROJECT_EDIT_FORM_STATE.data.links) {
    form_data.append("link_url", existing_link.url);
    form_data.append("link_type", existing_link.type);
  }
  form_data.set(
    "live_project_link",
    TEST_PROJECT_EDIT_FORM_STATE.data.live_project_link
      ? TEST_PROJECT_EDIT_FORM_STATE.data.live_project_link
      : "",
  );

  return form_data;
}

test("resetting errors when calling edit", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState({
    ...TEST_PROJECT_EDIT_FORM_STATE,
    errors: ["testing"],
  });
  const form_data = setUpEditFormData();

  handleAction(form_data);

  expect((await returned_action_promise).errors).toHaveLength(0);
});

test("updating form state with new value for existing media", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState({
    ...TEST_PROJECT_EDIT_FORM_STATE,
  });
  const form_data = setUpEditFormData();

  const test_existing_media_file =
    TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[0];
  form_data.delete("media_existing_hash");
  form_data.set(
    "media_existing_hash",
    TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[0].hash,
  );

  handleAction(form_data);

  expect((await returned_action_promise).data.existing_media).toEqual([
    test_existing_media_file,
  ]);
});

test("validating thumbnail is in media or existing media", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState(
    TEST_PROJECT_EDIT_FORM_STATE,
  );
  const form_data = setUpEditFormData();
  form_data.set("thumbnail", "testing.png");

  handleAction(form_data);

  const regex = /existing/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("uploading file with the correct parameters when editing", async () => {
  (fetch as jest.Mock).mockReset();
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState(
    TEST_PROJECT_EDIT_FORM_STATE,
  );
  const form_data = setUpEditFormData();
  form_data.append("media_file", TEST_DEFAULT_FILE_ONE);
  form_data.append("media_description", "testing_b");

  handleAction(form_data);
  await returned_action_promise;

  expect(fetch as jest.Mock).toHaveBeenCalledWith("https://testing.com", {
    method: "POST",
    body: new File(["testing_one"], "testing_one.png", {
      type: "image/png",
    }),
    headers: {
      Testing: "testing",
      "Content-Length": "9",
      "Content-Type": "image/png",
    },
  });
});

test("validating new media not in existing media", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState({
    ...TEST_PROJECT_EDIT_FORM_STATE,
    data: {
      ...TEST_PROJECT_EDIT_FORM_STATE.data,
      existing_media: [
        {
          url: "https://testing.com/testing",
          hash: "testing_sha1_hash",
          mime_type: "application/text",
          description: "Testing this out.",
        },
      ],
    },
  });
  const form_data = setUpEditFormData();
  form_data.append("media_file", TEST_DEFAULT_FILE_ONE);
  form_data.append("media_description", "testing_b");
  form_data.append("media_existing_hash", "testing_sha1_hash");
  form_data.set("thumbnail", "https://testing.com/testing");

  handleAction(form_data);

  const regex = /already uploaded/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test.each([
  [
    "name",
    (fd: FormData) => fd.set("name", "testing_new"),
    { name: "testing_new" },
  ],
  [
    "description",
    (fd: FormData) => fd.set("description", "testing_new"),
    { description: "testing_new" },
  ],
  [
    "tags",
    (fd: FormData) => fd.set("tags", "Testing, Testing, Testing "),
    { tags: ["Testing", "Testing", "Testing"] },
  ],
  [
    "visibility",
    (fd: FormData) => fd.set("visibility", "private"),
    { private: true },
  ],
  [
    "thumbnail",
    (fd: FormData) =>
      fd.set(
        "thumbnail",
        TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[1].url,
      ),
    {
      thumbnail_media: {
        url: TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[1].url,
        description:
          TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[1].description,
      },
    },
  ],
  [
    "links",
    (fd: FormData) => {
      fd.delete("link_url");
      fd.delete("link_type");
      fd.append("link_url", TEST_PROJECT_EDIT_FORM_STATE.data.links[0].url);
      fd.append("link_type", TEST_PROJECT_EDIT_FORM_STATE.data.links[0].type);
    },
    { links: [TEST_PROJECT_EDIT_FORM_STATE.data.links[0]] },
  ],
  [
    "live_project_link",
    (fd: FormData) =>
      fd.set(
        "live_project_link",
        TEST_PROJECT_EDIT_FORM_STATE.data.links[1].url,
      ),
    { live_project_link: TEST_PROJECT_EDIT_FORM_STATE.data.links[1].url },
  ],
])(
  "only updating %s when changed",
  async (attribute, set_callback, update_value) => {
    const mock_project_update_action = projectUpdateAction as jest.Mock;
    mock_project_update_action.mockReturnValue({
      code: "SUCCESS",
    });
    const returned_action_promise = mockUseActionState();
    const [errors, handleAction] = useProjectEditFormActionState(
      TEST_PROJECT_EDIT_FORM_STATE,
    );
    const form_data = setUpEditFormData();
    set_callback(form_data);

    handleAction(form_data);

    await returned_action_promise;
    expect(mock_project_update_action).toHaveBeenCalledWith(
      TEST_PROJECT_ONE.slug,
      update_value,
    );
  },
);

test("updating existing media elements adds to updated media list", async () => {
  const mock_project_update_action = projectUpdateAction as jest.Mock;
  mock_project_update_action.mockReturnValue({
    code: "SUCCESS",
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState(
    TEST_PROJECT_EDIT_FORM_STATE,
  );
  const form_data = setUpEditFormData();
  form_data.delete("media_existing_hash");
  form_data.append("media_file", TEST_DEFAULT_FILE_ONE);
  form_data.append("media_description", "testing_b");
  form_data.append(
    "media_existing_hash",
    TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[0].hash,
  );

  handleAction(form_data);

  await returned_action_promise;
  expect(mock_project_update_action).toHaveBeenCalledWith(
    TEST_PROJECT_ONE.slug,
    {
      media: [
        TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[0],
        {
          mime_type: "image/png",
          url: "https://testing.com",
          hash: "testing_sha1_hash",
          description: "testing_b",
        },
      ],
      removed_media_hashes: [
        TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[1].hash,
        TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[2].hash,
        TEST_PROJECT_EDIT_FORM_STATE.data.existing_media[3].hash,
      ],
    },
  );
});

test("updating thumbnail with newly uploaded file", async () => {
  const mock_project_update_action = projectUpdateAction as jest.Mock;
  mock_project_update_action.mockReturnValue({
    code: "SUCCESS",
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState(
    TEST_PROJECT_EDIT_FORM_STATE,
  );
  const form_data = setUpEditFormData();
  form_data.append("media_file", TEST_DEFAULT_FILE_ONE);
  form_data.append("media_description", "testing_b");
  form_data.set("thumbnail", "testing_b.png");

  handleAction(form_data);

  await returned_action_promise;
  expect(mock_project_update_action).toHaveBeenCalledWith(
    TEST_PROJECT_ONE.slug,
    {
      media: [
        ...TEST_PROJECT_EDIT_FORM_STATE.data.existing_media,
        {
          mime_type: "image/png",
          url: "https://testing.com",
          hash: "testing_sha1_hash",
          description: "testing_b",
        },
      ],
      thumbnail_media: {
        url: "https://testing.com",
        description: "testing_b",
      },
    },
  );
});

test("updating the project errors on server error", async () => {
  (projectUpdateAction as jest.Mock).mockReturnValue({
    code: "ERROR",
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectEditFormActionState(
    TEST_PROJECT_EDIT_FORM_STATE,
  );
  const form_data = setUpEditFormData();

  handleAction(form_data);

  const regex = /server/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test.todo("setting live_project_link to undefined");

// What happen when we keep a file in existing media files and upload the same file.
// test("files sorted by name before uploading");
// test("splitting tags for upload", async () => {});
// test("removing live project link if empty", async () => {});
// test("files report error on upload", () => {});
// test.todo("uploading media files to the file server");
// test.todo("using the media link returned by the file server");
// test.todo("failing file server upload returns error");
