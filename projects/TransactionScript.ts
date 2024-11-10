import { Project } from "@/services/db/schemas/Project";
import { WithId } from "mongodb";
import { ProjectCreate, ProjectUpdate } from "./DTOSchema";
import {
  DuplicateResult,
  InvalidScriptResult,
  NotFoundScriptResult,
  SlugScriptResult,
  SuccessfulScriptResult,
} from "./TransactionScriptResult";

export interface TransactionScript {
  create(
    project_create_input: ProjectCreate,
  ): Promise<SlugScriptResult | InvalidScriptResult | DuplicateResult>;

  find(slug: string): Promise<WithId<Project> | null>;

  findPublic(slug: string): Promise<WithId<Project> | null>;

  findAll(tags: Array<string>): Promise<Array<WithId<Project>>>;

  findAllPublic(tags: Array<string>): Promise<Array<WithId<Project>>>;

  update(
    slug: string,
    project_input: ProjectUpdate,
  ): Promise<
    | SlugScriptResult
    | NotFoundScriptResult
    | InvalidScriptResult
    | DuplicateResult
  >;

  delete(slug: string): Promise<SuccessfulScriptResult | NotFoundScriptResult>;
}
