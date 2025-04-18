import { Project } from "@/services/db/schemas/Project";
import { WithId } from "mongodb";
import { CollectionGateway } from "./CollectionGateway";
import { ProjectCreate, ProjectUpdate } from "./DTOSchema";
import { ProjectService } from "./ProjectService";
import {
  DuplicateResult,
  InvalidResult,
  NotFoundResult,
  ServiceResult,
  SlugResult,
  SuccessfulResult,
} from "./ProjectServiceResult";
import { Validator } from "./Validator";

export class ProjectsTransactionScript implements ProjectService {
  constructor(
    private project_validator: Validator,
    private projects_collection_gateway: CollectionGateway,
  ) {}

  async create(
    project_input: ProjectCreate,
  ): Promise<SlugResult | InvalidResult | DuplicateResult> {
    const slug = this.generateSlug(project_input.name);
    if ((await this.projects_collection_gateway.findBySlug(slug)) != null) {
      return {
        code: ServiceResult.DUPLICATE,
      };
    }

    const project: Project = {
      name: project_input.name,
      slug: slug,
      description: project_input.description,
      tags: project_input.tags,
      thumbnail_media: project_input.thumbnail_media,
      live_project_link: project_input.live_project_link,
      media: project_input.media,
      links: project_input.links,
      private: project_input.private,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const validation_result = this.project_validator.validate(project);
    if (!validation_result.valid) {
      return {
        code: ServiceResult.INVALID,
        message: validation_result.message,
      };
    }

    await this.projects_collection_gateway.insert(project);
    return {
      code: ServiceResult.SUCCESS,
      slug: project.slug,
    };
  }

  async find(slug: string): Promise<WithId<Project> | null> {
    return await this.projects_collection_gateway.findBySlug(slug);
  }

  async findByName(name: string): Promise<WithId<Project> | null> {
    return await this.projects_collection_gateway.findBySlug(
      this.generateSlug(name),
    );
  }

  async findPublic(slug: string): Promise<WithId<Project> | null> {
    return await this.projects_collection_gateway.findPublicBySlug(slug);
  }

  async findAll(tags: string[]): Promise<WithId<Project>[]> {
    return await this.projects_collection_gateway.findAll(tags);
  }

  async findAllPublic(tags: string[]): Promise<WithId<Project>[]> {
    return await this.projects_collection_gateway.findAllPublic(tags);
  }

  async update(
    slug: string,
    project_input: ProjectUpdate,
  ): Promise<SlugResult | NotFoundResult | InvalidResult | DuplicateResult> {
    const project = await this.find(slug);

    if (project == null) {
      return {
        code: ServiceResult.NOT_FOUND,
      };
    }

    const project_with_slug = this.buildProjectWithNewSlug(
      project,
      project_input,
    );

    if (
      project.slug != project_with_slug.slug &&
      (await this.projects_collection_gateway.findBySlug(
        project_with_slug.slug,
      )) != null
    ) {
      return {
        code: ServiceResult.DUPLICATE,
      };
    }

    const updated_project_info = {
      ...project_with_slug,
      ...project_input,
    };

    const validation_result =
      this.project_validator.validate(updated_project_info);
    if (!validation_result.valid) {
      return {
        code: ServiceResult.INVALID,
        message: validation_result.message,
      };
    }

    await this.projects_collection_gateway.update(project.slug, {
      ...project_input,
      slug: updated_project_info.slug,
      updated_at: new Date(),
    });

    return {
      code: ServiceResult.SUCCESS,
      slug: updated_project_info.slug,
    };
  }

  async delete(slug: string): Promise<SuccessfulResult | NotFoundResult> {
    const project = await this.find(slug);

    if (project == null) {
      return {
        code: ServiceResult.NOT_FOUND,
      };
    }

    await this.projects_collection_gateway.delete(slug);
    return {
      code: ServiceResult.SUCCESS,
    };
  }

  private generateSlug(project_name: string) {
    return project_name
      .replace(/[^a-zA-Z0-9\ ]/gi, "")
      .replaceAll(" ", "_")
      .toLowerCase();
  }

  private buildProjectWithNewSlug(
    project: Project,
    update_input: ProjectUpdate,
  ): Project {
    if (update_input.name != undefined) {
      return {
        ...project,
        slug: this.generateSlug(update_input.name),
      };
    }

    return project;
  }
}
