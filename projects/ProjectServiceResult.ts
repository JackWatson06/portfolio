export enum ServiceResult {
  SUCCESS = 1,
  NOT_FOUND,
  DUPLICATE,
  INVALID,
}

export type SuccessfulResult = {
  code: ServiceResult.SUCCESS;
};

export type SlugResult = {
  code: ServiceResult.SUCCESS;
  slug: string;
};

export type NotFoundResult = {
  code: ServiceResult.NOT_FOUND;
};

export type DuplicateResult = {
  code: ServiceResult.DUPLICATE;
};

export type InvalidResult = {
  code: ServiceResult.INVALID;
  message: string;
};
