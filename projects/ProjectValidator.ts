import {
  InvalidValidatorResult,
  SuccessfulValidatorResult,
  ValidatorResult,
} from "./ValidatorResult";
import { Validator } from "./Validator";
import { Project, MediaElement, Link } from "@/services/db/schemas/Project";

type ValidationRoutine = {
  error_message: string;
  is_valid: () => boolean;
};

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const VIDEO_TYPES = ["video/mp4"];
const VALID_MIME_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];
const VALID_SERVICE_TYPES = ["source", "website", "download"];

export class ProjectValidator implements Validator {
  validate(project: Project): ValidatorResult {
    const validation_routines: Array<ValidationRoutine> = [
      {
        error_message: "You must have at least one image.",
        is_valid: () =>
          project.media.length != 0 && this.mediaHasOnePicture(project.media),
      },
      {
        error_message:
          "You can only upload .png, .jpg, .webp, and .mp4 to the media files.",
        is_valid: () => this.mediaHasValidMimeTypes(project.media),
      },
      {
        error_message:
          "You can only choose 'source', 'website', or 'download' for the project links.",
        is_valid: () => this.linksHaveValidServiceTypes(project.links),
      },
      {
        error_message:
          "The media element you selected as the thumbnail does not exist.",
        is_valid: () =>
          this.thumbnailMediaUrlInMedia(
            project.thumbnail_media.url,
            project.media,
          ),
      },
      {
        error_message:
          "The primary link you selected does not exist in your links section.",
        is_valid: () =>
          project.live_project_link != undefined &&
          this.linksHaveUrl(project.live_project_link, project.links),
      },
      {
        error_message: "You can only use images for the thumbnail.",
        is_valid: () =>
          this.thumbnailMustBePicture(
            project.thumbnail_media.url,
            project.media,
          ),
      },
    ];

    for (const validation_routine of validation_routines) {
      if (!validation_routine.is_valid()) {
        return new InvalidValidatorResult(validation_routine.error_message);
      }
    }

    return new SuccessfulValidatorResult();
  }

  private mediaHasOnePicture(project_media_input: Array<MediaElement>) {
    return project_media_input.some((project_media_input) =>
      IMAGE_TYPES.includes(project_media_input.mime_type),
    );
  }

  private mediaHasValidMimeTypes(project_media_input: Array<MediaElement>) {
    return project_media_input.every((project_media_input) =>
      VALID_MIME_TYPES.includes(project_media_input.mime_type),
    );
  }

  private linksHaveValidServiceTypes(create_project_links_input: Array<Link>) {
    return create_project_links_input.every((project_link_input) =>
      VALID_SERVICE_TYPES.includes(project_link_input.type),
    );
  }

  private thumbnailMediaUrlInMedia(
    thumbnail_url: string,
    project_media_input: Array<MediaElement>,
  ) {
    return project_media_input.some(
      (project_media_input) => project_media_input.url === thumbnail_url,
    );
  }

  private linksHaveUrl(url: string, create_project_links_input: Array<Link>) {
    return create_project_links_input.some(
      (project_link_input) => project_link_input.url === url,
    );
  }

  private thumbnailMustBePicture(
    thumbnail_url: string,
    project_media_input: Array<MediaElement>,
  ) {
    return project_media_input.some(
      (project_media_input) =>
        project_media_input.url === thumbnail_url &&
        IMAGE_TYPES.includes(project_media_input.mime_type),
    );
  }
}
