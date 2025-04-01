export enum ServiceResult {
  SUCCESS = 1,
  SERVICE_ERROR,
  NOT_FOUND,
}

export type SuccessfulResult = {
  code: ServiceResult.SUCCESS;
};

export type ServiceErrorResult = {
  code: ServiceResult.SERVICE_ERROR;
};

export type NotFoundResult = {
  code: ServiceResult.NOT_FOUND;
};
