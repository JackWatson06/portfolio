import { useActionState } from "react";
import { projectUploadAction } from "./actions";

import { fetchBlobUploadParameters, fetchProjectWithName } from "./queries";
import { sha1HashBlob } from "./libs";

export type MediaFormSchema = {
  file: File;
  description: string;
};

export type LinkFormSchema = {
  url: string;
  type: string;
};

export type ProjectFormSchema = {
  name: string;
  description: string;
  tags: string;
  visibility: string;
  media: MediaFormSchema[];
  thumbnail: string;
  links: LinkFormSchema[];
  live_project_link?: string;
};

export type ProjectFormState = {
  errors: string[];
  data: ProjectFormSchema;
};

type UploadedMedia = {
  file_name: string;
  mime_type: string;
  url: string;
  description: string;
};
type MediaUploadResult = {
  error?: string;
  uploaded_media: UploadedMedia[];
};

function updateFormState(
  form_data: FormData,
  prev_state: ProjectFormState,
): ProjectFormState {
  const name = form_data.get("name");
  const description = form_data.get("description");
  const tags = form_data.get("tags");
  const visibility = form_data.get("visibility");
  const media_file = form_data.getAll("media_file") as File[];
  const media_descriptions = form_data.getAll("media_description");
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
      thumbnail: thumbnail ? thumbnail.toString() : prev_state.data.thumbnail,
      links: link_urls.map((url, index) => ({
        url: url.toString(),
        type: link_types[index].toString(),
      })),
      live_project_link: live_project_link
        ? live_project_link.toString()
        : undefined,
    },
  };
}

function validThumbnail(thumbnail: string, media: MediaFormSchema[]): boolean {
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

async function validatingWhileAddingToErrors(
  project_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  if (
    !validThumbnail(
      project_form_state.data.thumbnail,
      project_form_state.data.media,
    )
  ) {
    project_form_state.errors.push(
      "Thumbnail missing from the media files. Please put the name of the file you want to use for the thumbnail.",
    );
  }

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

  if (!(await validNameForSlug(project_form_state.data.name))) {
    project_form_state.errors.push(
      "The name your using for your project already exists in the system so it can't be used for the slug.",
    );
  }

  return project_form_state;
}

async function uploadFile(file: File): Promise<string | null> {
  const sha1_hash = await sha1HashBlob(file);
  const upload_params = await fetchBlobUploadParameters(sha1_hash);

  if (upload_params == null) {
    return null;
  }

  try {
    const response = await fetch(upload_params.upload.url, {
      method: upload_params.upload.method,
      body: file,
      headers: upload_params.upload.headers,
    });

    if (response.status >= 300) {
      return null;
    }

    return upload_params.public_url;
  } catch (e) {
    return null;
  }
}

async function uploadMediaFile(media: MediaFormSchema): Promise<UploadedMedia> {
  return new Promise(async (resolve, reject) => {
    const public_url = await uploadFile(media.file);

    if (public_url == null) {
      return reject("Could not upload the file: " + media.file.name);
    }

    return resolve({
      file_name: media.file.name,
      mime_type: media.file.type,
      url: public_url,
      description: media.description,
    });
  });
}

async function uploadMediaFiles(
  media: MediaFormSchema[],
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

async function createProject(
  valid_form_state: ProjectFormState,
): Promise<ProjectFormState> {
  const uploaded_media_results = await uploadMediaFiles(
    valid_form_state.data.media,
  );
  if (uploaded_media_results.error != undefined) {
    return {
      errors: [uploaded_media_results.error],
      data: valid_form_state.data,
    };
  }

  const uploaded_thumbnail = findThumbnailUploadedMedia(
    valid_form_state.data.thumbnail,
    uploaded_media_results.uploaded_media,
  );
  if (uploaded_thumbnail == null) {
    return {
      errors: ["After uploading media the thumbnail could not be found."],
      data: valid_form_state.data,
    };
  }

  const uploaded_response = await projectUploadAction({
    name: valid_form_state.data.name,
    description: valid_form_state.data.description,
    tags: valid_form_state.data.tags.split(",").map((tag) => tag.trim()),
    private: valid_form_state.data.visibility == "private" ? true : false,
    media: uploaded_media_results.uploaded_media
      .sort(sortUploadedMedia)
      .map((uploaded_media) => {
        return {
          url: uploaded_media.url,
          mime_type: uploaded_media.mime_type,
          description: uploaded_media.description,
        };
      }),
    thumbnail_media: {
      url: uploaded_thumbnail.url,
      description: uploaded_thumbnail.description,
    },
    links: valid_form_state.data.links,
    live_project_link: valid_form_state.data.live_project_link,
  });
  if (uploaded_response.code == "ERROR") {
    return {
      errors: [
        "Server returned with an error while trying to upload the project.",
      ],
      data: valid_form_state.data,
    };
  }
  return valid_form_state;
}

export function useProjectFormActionState(
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
      data: { ...prev_state.data },
    };
    const form_state_with_new_attrs = updateFormState(
      form_data,
      state_without_errors,
    );
    if (form_state_with_new_attrs.errors.length > 0) {
      return form_state_with_new_attrs;
    }

    const validated_state = await validatingWhileAddingToErrors(
      form_state_with_new_attrs,
    );
    if (validated_state.errors.length > 0) {
      return validated_state;
    }

    return await createProject(validated_state);
  }

  return useActionState(handleFormUploadAction, initial_state);
}
