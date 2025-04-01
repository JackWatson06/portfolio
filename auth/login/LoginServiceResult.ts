export enum ServiceResult {
  SUCCESS = 1,
  INVALID,
}

export type SuccessfulResult = {
  code: ServiceResult.SUCCESS;
  token: string;
  secure: boolean;
  expires: number;
};

export type InvalidResult = {
  code: ServiceResult.INVALID;
};
