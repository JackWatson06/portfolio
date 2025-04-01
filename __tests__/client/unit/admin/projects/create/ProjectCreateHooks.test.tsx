import { TEST_PROJECT_ONE } from "@/__tests__/seeding/projects/ProjectData";
import { projectUploadAction } from "@/app/admin/projects/create/actions";
import {
  useProjectFormActionState,
  ProjectFormState,
  ProjectFormSchema,
} from "@/app/admin/projects/create/hooks";
import {
  fetchBlobUploadParameters,
  fetchProjectWithName,
} from "@/app/admin/projects/create/queries";
import { ProjectCreate } from "@/projects/DTOSchema";
import { useActionState } from "react";

/* -------------------------------------------------------------------------- */
/*                                  Test Data                                 */
/* -------------------------------------------------------------------------- */

global.fetch = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));
jest.mock("@/app/admin/projects/create/queries", () => ({
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
}));
jest.mock("@/app/admin/projects/create/libs", () => ({
  sha1HashBlob: jest.fn().mockReturnValue("testing_sha1_hash"),
}));
jest.mock("@/app/admin/projects/create/actions", () => ({
  projectUploadAction: jest.fn(),
}));

const TEST_DEFAULT_FILE_ONE = new File(["testing_b"], "testing_b.png", {
  type: "image/png",
});
const TEST_DEFAULT_FILE_TWO = new File(["testing_a"], "testing_a.jpg", {
  type: "image/jpeg",
});

const TEST_DEFAULT_FORM_STATE: ProjectFormState = {
  data: {
    name: "testing",
    description: "testing",
    tags: "testing_one, testing_two, testing_three",
    visibility: "private",
    media: [
      { file: TEST_DEFAULT_FILE_ONE, description: "testing_b" },
      { file: TEST_DEFAULT_FILE_TWO, description: "testing_a" },
    ],
    thumbnail: "testing_a.jpg",
    links: [
      { url: "https://localhost.com", type: "source" },
      { url: "https://localhost.com/testing", type: "website" },
    ],
    live_project_link: "https://localhost.com/testing",
  },
  errors: [],
};

function setUpFormData(): FormData {
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

const TEST_PROJECT_CREATE_INPUT: ProjectCreate = {
  name: "testing",
  description: "testing",
  tags: ["C++", "TypeScript", "Jest"],
  private: true,
  media: [
    {
      mime_type: "image/jpeg",
      url: "https://testing.com",
      description: "testing_a",
    },
    {
      mime_type: "image/png",
      url: "https://testing.com",
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

function mockUseActionState(): Promise<ProjectFormState> {
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
            resolve(action(initial_state, form_data));
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
  (projectUploadAction as jest.Mock).mockReset();
  (projectUploadAction as jest.Mock).mockReturnValue({
    code: "SUCCESS",
  });
});

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */
test("reseting errors when uploading form", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState({
    errors: ["testing"],
    data: { ...TEST_DEFAULT_FORM_STATE.data },
  });
  const form_data = setUpFormData();

  handleAction(form_data);

  expect((await returned_action_promise).errors).toHaveLength(0);
});

test("error while uploading a form with descriptions length not matching files", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();
  form_data.append("media_description", "testing");

  handleAction(form_data);

  const regex = /length/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("error while uploading a form with links length not matching types", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();
  form_data.append("link_url", "testing");

  handleAction(form_data);

  const regex = /length/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

/* -------------------- Test defaulting fields if not set ------------------- */
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
    const [errors, handleAction] = useProjectFormActionState(
      TEST_DEFAULT_FORM_STATE,
    );
    const form_data = setUpFormData();
    form_data.delete(attribute);

    handleAction(form_data);

    const action_response = await returned_errors_promise;
    expect(get_callback(action_response.data)).toBe(prev_value);
  },
);

/* ------------------------ Test updating field state ----------------------- */
const TEST_NEW_FILE = new File(["testing_new"], "testing_new.png", {
  type: "image/png",
});
function setNewMedia(fd: FormData) {
  fd.delete("media_file");
  fd.delete("media_description");

  fd.append("media_file", TEST_NEW_FILE);
  fd.append("media_description", "testing_new_description");

  fd.set("thumbnail", "testing_new.png");
}

function setNewLinks(fd: FormData) {
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
    setNewMedia,
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
    setNewLinks,
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
    const returned_errors_promise = mockUseActionState();
    const [errors, handleAction] = useProjectFormActionState(
      TEST_DEFAULT_FORM_STATE,
    );
    const form_data = setUpFormData();
    set_callback(form_data);

    handleAction(form_data);

    const action_response = await returned_errors_promise;
    expect(get_callback(action_response.data)).toEqual(new_value);
  },
);

test("validating thumbnail is media element", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();
  form_data.set("thumbnail", "testing.png");

  handleAction(form_data);

  const regex = /thumbnail/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("validating primary link exists in links", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();
  form_data.set("live_project_link", "https://does_not_exist.com");

  handleAction(form_data);

  const regex = /live project link/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("validating slug does not exist", async () => {
  (fetchProjectWithName as jest.Mock).mockReturnValueOnce(TEST_PROJECT_ONE);
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

  handleAction(form_data);

  const regex = /slug/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("uploading file with the correct parameters", async () => {
  (fetch as jest.Mock).mockReset();
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

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
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

  handleAction(form_data);

  const regex = /upload/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("uploading file returns error when we fetch fails", async () => {
  (fetch as jest.Mock).mockImplementationOnce(() => {
    throw Error("testing");
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

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
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

  handleAction(form_data);

  const regex = /upload/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

test("transforming form input before creating", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

  handleAction(form_data);
  await returned_action_promise;

  expect(projectUploadAction as jest.Mock).toHaveBeenCalledWith(
    TEST_PROJECT_CREATE_INPUT,
  );
});

test("transforming form input sets live_project_link to undefined if empty", async () => {
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

  form_data.set("live_project_link", "");

  handleAction(form_data);
  await returned_action_promise;

  const expected_project_create_input = {
    ...TEST_PROJECT_CREATE_INPUT,
  };
  delete expected_project_create_input.live_project_link;
  expect(projectUploadAction as jest.Mock).toHaveBeenCalledWith(
    expected_project_create_input,
  );
});

test("creating the project errors on server error", async () => {
  (projectUploadAction as jest.Mock).mockReturnValue({
    code: "ERROR",
  });
  const returned_action_promise = mockUseActionState();
  const [errors, handleAction] = useProjectFormActionState(
    TEST_DEFAULT_FORM_STATE,
  );
  const form_data = setUpFormData();

  handleAction(form_data);

  const regex = /server/gi;
  const action_response = (await returned_action_promise).errors[0];
  expect(action_response.match(regex)).not.toBeNull();
});

// test("files sorted by name before uploading");
// test("splitting tags for upload", async () => {});
// test("removing live project link if empty", async () => {});
// test("files report error on upload", () => {});
// test.todo("uploading media files to the file server");
// test.todo("using the media link returned by the file server");
// test.todo("failing file server upload returns error");
