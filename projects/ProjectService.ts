import { Project } from "@/services/db/schemas/Project";
import { WithId } from "mongodb";
import { ProjectCreate, ProjectUpdate } from "./DTOSchema";
import {
  DuplicateResult,
  InvalidResult,
  NotFoundResult,
  SlugResult,
  SuccessfulResult,
} from "./ProjectServiceResult";

export interface ProjectService {
  create(
    project_create_input: ProjectCreate,
  ): Promise<SlugResult | InvalidResult | DuplicateResult>;
  find(slug: string): Promise<WithId<Project> | null>;
  findByName(name: string): Promise<WithId<Project> | null>;
  findPublic(slug: string): Promise<WithId<Project> | null>;
  findAll(tags: Array<string>): Promise<Array<WithId<Project>>>;
  findAllPublic(tags: Array<string>): Promise<Array<WithId<Project>>>;
  update(
    slug: string,
    project_input: ProjectUpdate,
  ): Promise<SlugResult | NotFoundResult | InvalidResult | DuplicateResult>;
  delete(slug: string): Promise<SuccessfulResult | NotFoundResult>;
}
