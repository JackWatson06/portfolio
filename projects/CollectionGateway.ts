import { Project } from "@/services/db/schemas/Project";
import { MatchKeysAndValues, WithId } from "mongodb";

export interface CollectionGateway {
  insert(project: Project): Promise<void>;
  findBySlug(slug: string): Promise<WithId<Project> | null>;
  findPublicBySlug(slug: string): Promise<WithId<Project> | null>;
  findAll(tags: Array<string>): Promise<Array<WithId<Project>>>;
  findAllPublic(tags: Array<string>): Promise<Array<WithId<Project>>>;
  update(slug: string, project: MatchKeysAndValues<Project>): Promise<void>;
  delete(slug: string): Promise<void>;
}
