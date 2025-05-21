import { Project } from "@/services/db/schemas/Project";
import { MatchKeysAndValues, WithId } from "mongodb";

type ProjectKeys = keyof Project;
type ProjectTypeWithNever = {
  [K in ProjectKeys]: undefined extends Project[K] ? K : never;
}; // Create a new type based on all the keys in ProjectKeys. If undefined is in the type then make it the key name otherwise set it to never.
type ProjectWithUndefined = ProjectTypeWithNever[keyof Project]; // This essentially pulls out all the values for the type which we may have never so
export type ProjectUnset = Partial<{
  [K in ProjectWithUndefined]: true | "" | 1;
}>;

export interface CollectionGateway {
  insert(project: Project): Promise<void>;
  findBySlug(slug: string): Promise<WithId<Project> | null>;
  findPublicBySlug(slug: string): Promise<WithId<Project> | null>;
  findAll(tags: Array<string>): Promise<Array<WithId<Project>>>;
  findAllPublic(tags: Array<string>): Promise<Array<WithId<Project>>>;
  someHaveMediaHash(hash: string): Promise<boolean>;
  update(
    slug: string,
    project: MatchKeysAndValues<Project>,
    unset: ProjectUnset,
  ): Promise<void>;
  delete(slug: string): Promise<void>;
}
