export interface ValidatorResult {
  message: string;
  valid: boolean;
}

export class SuccessfulValidatorResult implements ValidatorResult {
  valid: boolean = true;
  message: string = "Successfully validated project.";
}

export class InvalidValidatorResult implements ValidatorResult {
  valid = false;

  constructor(readonly message: string) {}
}
