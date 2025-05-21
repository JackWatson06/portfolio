import { useActionState } from "react";
import {
  projectCreateAction,
  projectUpdateAction,
  fetchBlobUploadParameters,
  fetchProjectWithName,
} from "./actions";

import { sha1HashBlob } from "./libs";
import {
  ExistingMediaFormSchema,
  LinkFormSchema,
  MediaFormSchema,
  ProjectFormState,
} from "./schemas";
import { MediaInput } from "@/projects/DTOSchema";

/* --------------------------------- Schemas -------------------------------- */
type UploadedMedia = {
  file_name: string;
  mime_type: string;
  hash: string;
  url: string;
  description: string;
};

type HashedMediaFile = {
  hash: string;
  media_form_data: MediaFormSchema;
};

type MediaUploadResult = {
  error?: string;
  uploaded_media: UploadedMedia[];
};

type Thumbnail = {
  url: string;
  description: string;
};

/* ---------------------- Edit/Create Project Functions --------------------- */
function updateFormState(
  form_data: FormData,
  prev_state: ProjectFormState,
): ProjectFormState {
  const name = form_data.get("name");
  const description = form_data.get("description");
  const tags = form_data.get("tags");
  const visibility = form_data.get("visibility");
  // We have to filter here because an empty file input will have a zero length file.
  // See https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-form-data-set
  // 4.10.21.4 Constructing the entry list (Step 8)
  const media_file = (form_data.getAll("media_file") as File[]).filter(
    (file) =>
      !(
        file.name == "" &&
        file.size == 0 &&
        file.type == "application/octet-stream"
      ),
  );
  const media_descriptions = form_data.getAll("media_description");
  const media_existing_hash = form_data.getAll(
    "media_existing_hash",
  ) as string[];
  const thumbnail = form_data.get("thumbnail");
  const link_urls = form_data.getAll("link_url");
  const link_types = form_data.getAll("link_type");
  const live_project_link = form_data.get("live_project_link");

  if (media_file.length != media_descriptions.length) {
    return {
      ...prev_state,
      errors: [
        "Media files must have the same length as the media description.",
      ],
    };
  }

  if (link_urls.length != link_types.length) {
    return {
      ...prev_state,
      errors: ["Link urls must have the same length as the types."],
    };
  }

  return {
    ...prev_state,
    data: {
      name: name ? name.toString() : prev_state.data.name,
      description: description
        ? description.toString()
        : prev_state.data.description,
      tags: tags ? tags.toString() : prev_state.data.tags,
      visibility: visibility
        ? visibility.toString()
        : prev_state.data.visibility,
      media: media_file.map((file, index) => ({
        file: file,
        description: media_descriptions[index].toString(),
      })),
      existing_media: prev_state.data.existing_media.filter(
        (prev_existing_media) =>
          media_existing_hash.includes(prev_existing_media.hash),
      ),
      thumbnail: thumbnail ? thumbnail.toString() : prev_state.data.thumbnail,
      links: link_urls.map((url, index) => ({
        url: url.toString(),
        type: link_types[index].toString(),
      })),
      live_project_link: live_project_link ? live_project_link.toString() : "",
    },
  };
}

function validThumbnailInMedia(
  thumbnail: string,
  media: MediaFormSchema[],
): boolean {
  for (const media_element of media) {
    if (media_element.file.name == thumbnail) {
      return true;
    }
  }

  return false;
}

function validLiveProjectLink(
  live_project_link: string,
  links: LinkFormSchema[],
): boolean {
  for (const link of links) {
    if (link.url == live_project_link) {
      return true;
    }
  }

  return false;
}

async function validNameForSlug(name: string): Promise<boolean> {
  if ((await fetchProjectWithName(name)) == null) {
    return true;
  }

  return false;
}

async function validateLinkInput(
  project_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  if (
    project_form_state.data.live_project_link &&
    !validLiveProjectLink(
      project_form_state.data.live_project_link,
      project_form_state.data.links,
    )
  ) {
    project_form_state.errors.push(
      "Live project link missing from the links. Please put the name of the link you want to use for the live project link.",
    );
  }

  return project_form_state;
}

async function hashNewMediaFiles(
  media_form_data: MediaFormSchema[],
): Promise<HashedMediaFile[]> {
  return Promise.all(
    media_form_data.map(async (media_form_data_element) => ({
      hash: await sha1HashBlob(media_form_data_element.file),
      media_form_data: media_form_data_element,
    })),
  );
}

async function uploadFile(
  sha1_hash: string,
  file: File,
): Promise<string | null> {
  const upload_params = await fetchBlobUploadParameters(sha1_hash);

  if (upload_params == null) {
    return null;
  }

  try {
    const response = await fetch(upload_params.upload.url, {
      method: upload_params.upload.method,
      body: file,
      headers: {
        ...upload_params.upload.headers,
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
      },
    });

    if (response.status >= 300) {
      return null;
    }

    return upload_params.public_url;
  } catch (e) {
    return null;
  }
}

async function uploadMediaFile(
  hashed_media_file: HashedMediaFile,
): Promise<UploadedMedia> {
  return new Promise(async (resolve, reject) => {
    const uploaded_url = await uploadFile(
      hashed_media_file.hash,
      hashed_media_file.media_form_data.file,
    );

    if (uploaded_url == null) {
      return reject(
        "Could not upload the file: " +
          hashed_media_file.media_form_data.file.name,
      );
    }

    return resolve({
      file_name: hashed_media_file.media_form_data.file.name,
      mime_type: hashed_media_file.media_form_data.file.type,
      url: uploaded_url,
      hash: hashed_media_file.hash,
      description: hashed_media_file.media_form_data.description,
    });
  });
}

async function uploadMediaFiles(
  media: HashedMediaFile[],
): Promise<MediaUploadResult> {
  try {
    return {
      uploaded_media: await Promise.all(media.map(uploadMediaFile)),
    };
  } catch (err) {
    if (typeof err == "string") {
      return {
        error: err,
        uploaded_media: [],
      };
    }
    return {
      error: "Could not uplaod the files.",
      uploaded_media: [],
    };
  }
}

function sortUploadedMedia(one: UploadedMedia, two: UploadedMedia) {
  if (one.file_name == two.file_name) {
    return 0;
  }

  return one.file_name > two.file_name ? 1 : -1;
}

function findThumbnailUploadedMedia(
  thumbnail: string,
  uploaded_media: UploadedMedia[],
): UploadedMedia | null {
  for (const uploaded_media_element of uploaded_media) {
    if (uploaded_media_element.file_name == thumbnail) {
      return uploaded_media_element;
    }
  }

  return null;
}

/* ----------------------------- Create Project ----------------------------- */
async function createProject(
  valid_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  const hashed_media_files = await hashNewMediaFiles(
    valid_form_state.data.media,
  );
  const uploaded_media_results = await uploadMediaFiles(hashed_media_files);
  if (uploaded_media_results.error != undefined) {
    return {
      errors: [uploaded_media_results.error],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }

  const uploaded_thumbnail = findThumbnailUploadedMedia(
    valid_form_state.data.thumbnail,
    uploaded_media_results.uploaded_media,
  );
  if (uploaded_thumbnail == null) {
    // This "should" theoretically never be hit. It should be
    // imposible because any failed uploads will return before this gets called and if we validated
    // before hand we should have the thumbnail.
    return {
      errors: ["After uploading media the thumbnail could not be found."],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }

  const uploaded_response = await projectCreateAction({
    ...{
      name: valid_form_state.data.name,
      description: valid_form_state.data.description,
      tags: valid_form_state.data.tags
        .split(",")
        .map((tag: string) => tag.trim()),
      private: valid_form_state.data.visibility == "private",
      media: uploaded_media_results.uploaded_media
        .sort(sortUploadedMedia)
        .map((uploaded_media) => {
          return {
            url: uploaded_media.url,
            mime_type: uploaded_media.mime_type,
            hash: uploaded_media.hash,
            description: uploaded_media.description,
          };
        }),
      thumbnail_media: {
        url: uploaded_thumbnail.url,
        description: uploaded_thumbnail.description,
      },
      links: valid_form_state.data.links,
    },
    ...(valid_form_state.data.live_project_link != ""
      ? { live_project_link: valid_form_state.data.live_project_link }
      : {}),
  });
  if (uploaded_response.code == "ERROR") {
    return {
      errors: [
        "Server returned with an error while trying to upload the project.",
      ],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }
  return valid_form_state;
}

async function validateCreateForm(
  project_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  if (
    !validThumbnailInMedia(
      project_form_state.data.thumbnail,
      project_form_state.data.media,
    )
  ) {
    project_form_state.errors.push(
      "Thumbnail missing from the media files. Please put the name of the file you want to use for the thumbnail.",
    );
  }

  if (!(await validNameForSlug(project_form_state.data.name))) {
    project_form_state.errors.push(
      "The name your using for your project already exists in the system so it can't be used for the slug.",
    );
  }

  return validateLinkInput(project_form_state);
}

export function useProjectCreateFormActionState(
  initial_state: ProjectFormState,
): [
  state: ProjectFormState,
  dispatch: (payload: FormData) => void,
  isPending: boolean,
] {
  async function handleFormUploadAction(
    prev_state: ProjectFormState,
    form_data: FormData,
  ) {
    const state_without_errors = {
      errors: [],
      slug: prev_state.slug,
      data: { ...prev_state.data },
    };
    const form_state_with_new_attrs = updateFormState(
      form_data,
      state_without_errors,
    );
    if (form_state_with_new_attrs.errors.length > 0) {
      return form_state_with_new_attrs;
    }

    const validated_state = await validateCreateForm(form_state_with_new_attrs);
    if (validated_state.errors.length > 0) {
      return validated_state;
    }

    return await createProject(validated_state);
  }

  return useActionState(handleFormUploadAction, initial_state);
}

/* ------------------------------ Edit Project ------------------------------ */
function validThumbnailInExistingMedia(
  thumbnail: string,
  existing_media: ExistingMediaFormSchema[],
): boolean {
  return (
    existing_media.find((existing_media_element) => {
      return existing_media_element.url == thumbnail;
    }) != undefined
  );
}

function validateNewMediaNotInExisting(
  hashed_media_files: HashedMediaFile[],
  existing_media: ExistingMediaFormSchema[],
) {
  for (const hashed_media_file of hashed_media_files) {
    if (
      existing_media.find(
        (existing_media_element) =>
          existing_media_element.hash == hashed_media_file.hash,
      )
    ) {
      return false;
    }
  }

  return true;
}

async function validateEditForm(
  project_form_state: ProjectFormState,
  prev_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  if (
    !validThumbnailInMedia(
      project_form_state.data.thumbnail,
      project_form_state.data.media,
    ) &&
    !validThumbnailInExistingMedia(
      project_form_state.data.thumbnail,
      project_form_state.data.existing_media,
    )
  ) {
    project_form_state.errors.push(
      "Thumbnail missing from the media files or existing media files. Please put the name of the new file you want to use for the thumbnail or an existing URL.",
    );
  }

  if (
    project_form_state.data.name != prev_form_state.data.name &&
    !(await validNameForSlug(project_form_state.data.name))
  ) {
    project_form_state.errors.push(
      "The name your using for your project already exists in the system so it can't be used for the slug.",
    );
  }

  return validateLinkInput(project_form_state);
}

function findThumnailInExistingOrUploaded(
  thumbnail: string,
  uploaded_media: UploadedMedia[],
  existing_media: ExistingMediaFormSchema[],
): Thumbnail | null {
  for (const uploaded_media_element of uploaded_media) {
    if (uploaded_media_element.file_name == thumbnail) {
      return {
        url: uploaded_media_element.url,
        description: uploaded_media_element.description,
      };
    }
  }

  for (const existing_media_element of existing_media) {
    if (existing_media_element.url == thumbnail) {
      return {
        url: existing_media_element.url,
        description: existing_media_element.description,
      };
    }
  }

  return null;
}

function linksCompare(
  links_one: LinkFormSchema[],
  links_two: LinkFormSchema[],
): boolean {
  if (links_one.length != links_two.length) {
    return false;
  }

  for (let i = 0; i < links_one.length; ++i) {
    if (
      links_one[i].type != links_two[i].type ||
      links_one[i].url != links_two[i].url
    ) {
      return false;
    }
  }

  return true;
}

function mediaCompare(
  media_one: MediaInput[],
  media_two: MediaInput[],
): boolean {
  if (media_one.length != media_two.length) {
    return false;
  }

  for (let i = 0; i < media_one.length; ++i) {
    if (
      media_one[i].url != media_two[i].url ||
      media_one[i].description != media_two[i].description ||
      media_one[i].mime_type != media_two[i].mime_type ||
      media_one[i].hash != media_two[i].hash
    ) {
      return false;
    }
  }

  return true;
}

async function editProject(
  valid_form_state: ProjectFormState,
  prev_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  const hashed_media_files = await hashNewMediaFiles(
    valid_form_state.data.media,
  );
  if (
    !validateNewMediaNotInExisting(
      hashed_media_files,
      valid_form_state.data.existing_media,
    )
  ) {
    return {
      errors: [
        "Media file was already uploaded previously. Please choose a new file or remove the file from the existing files.",
      ],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }

  const uploaded_media_results = await uploadMediaFiles(hashed_media_files);
  if (uploaded_media_results.error != undefined) {
    return {
      errors: [uploaded_media_results.error],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }

  const removed_media_hashes = prev_form_state.data.existing_media
    .filter((existing_media) => {
      return !valid_form_state.data.existing_media.find(
        (new_existing_media_element) =>
          new_existing_media_element.hash == existing_media.hash,
      );
    })
    .map((existing_media) => existing_media.hash);

  // This will find the thumbnail in the uploaded media file. Theoretically it should not be null.
  const uploaded_thumbnail = findThumnailInExistingOrUploaded(
    valid_form_state.data.thumbnail,
    uploaded_media_results.uploaded_media,
    valid_form_state.data.existing_media,
  );
  if (uploaded_thumbnail == null) {
    // This "should" theoretically never be hit. It should be
    // imposible because any failed uploads will return before this gets called and if we validated
    // before hand we should have the thumbnail.
    return {
      errors: ["After uploading media the thumbnail could not be found."],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }
  const media_files: MediaInput[] = [
    ...valid_form_state.data.existing_media,
    ...uploaded_media_results.uploaded_media.map((uploaded_media) => ({
      url: uploaded_media.url,
      description: uploaded_media.description,
      mime_type: uploaded_media.mime_type,
      hash: uploaded_media.hash,
    })),
  ];

  const uploaded_response = await projectUpdateAction(valid_form_state.slug, {
    ...(valid_form_state.data.name != prev_form_state.data.name
      ? { name: valid_form_state.data.name }
      : {}),

    ...(valid_form_state.data.description != prev_form_state.data.description
      ? { description: valid_form_state.data.description }
      : {}),

    ...(valid_form_state.data.tags != prev_form_state.data.tags
      ? {
          tags: valid_form_state.data.tags
            .split(",")
            .map((tag: string) => tag.trim()),
        }
      : {}),

    ...(valid_form_state.data.visibility != prev_form_state.data.visibility
      ? { private: valid_form_state.data.visibility == "private" }
      : {}),

    ...(mediaCompare(prev_form_state.data.existing_media, media_files) == false
      ? { media: media_files }
      : {}),

    ...(prev_form_state.data.thumbnail != uploaded_thumbnail.url
      ? { thumbnail_media: uploaded_thumbnail }
      : {}),

    ...(linksCompare(valid_form_state.data.links, prev_form_state.data.links) ==
    false
      ? { links: valid_form_state.data.links }
      : {}),

    ...(valid_form_state.data.live_project_link !=
    prev_form_state.data.live_project_link
      ? { live_project_link: valid_form_state.data.live_project_link }
      : {}),

    ...(removed_media_hashes.length != 0
      ? { removed_media_hashes: removed_media_hashes }
      : {}),
  });

  if (uploaded_response.code == "ERROR") {
    return {
      errors: [
        "Server returned with an error while trying to upload the project.",
      ],
      slug: valid_form_state.slug,
      data: valid_form_state.data,
    };
  }

  return {
    errors: [],
    slug: uploaded_response.slug,
    data: valid_form_state.data,
  };
}

export function useProjectEditFormActionState(
  initial_state: ProjectFormState,
): [
  state: ProjectFormState,
  dispatch: (payload: FormData) => void,
  isPending: boolean,
] {
  async function handleFormUploadAction(
    prev_state: ProjectFormState,
    form_data: FormData,
  ) {
    const state_without_errors = {
      errors: [],
      slug: prev_state.slug,
      data: { ...prev_state.data },
    };

    const form_state_with_new_attrs = updateFormState(
      form_data,
      state_without_errors,
    );
    if (form_state_with_new_attrs.errors.length > 0) {
      return form_state_with_new_attrs;
    }

    const validated_form_state = await validateEditForm(
      form_state_with_new_attrs,
      prev_state,
    );
    if (validated_form_state.errors.length > 0) {
      return validated_form_state;
    }

    return editProject(form_state_with_new_attrs, prev_state);
  }

  return useActionState(handleFormUploadAction, initial_state);
}
