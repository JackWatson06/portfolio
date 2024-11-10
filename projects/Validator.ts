import { Project } from "@/services/db/schemas/Project";
import { ValidatorResult } from "./ValidatorResult";

export interface Validator {
  validate(project: Project): ValidatorResult;
}
