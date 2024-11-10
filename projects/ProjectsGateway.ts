import { Project } from "@/services/db/schemas/Project";
import { Collection, MatchKeysAndValues, WithId } from "mongodb";
import { CollectionGateway } from "./CollectionGateway";

export class ProjectsGateway implements CollectionGateway {
  public constructor(private projects: Collection<Project>) {}
  
  
  async insert(project: Project): Promise<void> {
    this.projects.insertOne(project);
  }

  async findBySlug(slug: string): Promise<WithId<Project> | null> {
    return this.projects.findOne({
      slug: slug,
      deleted_at: {
        $exists: false,
      },
    });
  }

  async findPublicBySlug(slug: string): Promise<WithId<Project> | null> {
    return this.projects.findOne({
      slug: slug,
      private: false,
      deleted_at: {
        $exists: false,
      },
    });
  }

  async findAll(tags: Array<string>): Promise<Array<WithId<Project>>> {
    if (tags.length != 0) {
      return (
        await this.projects.find({
          $text: {
            $search: tags.join(" "),
          },
          deleted_at: {
            $exists: false,
          },
        })
      ).toArray();
    }

    return (
      await this.projects.find({
        deleted_at: {
          $exists: false,
        },
      })
    ).toArray();
  }

  async findAllPublic(tags: string[]): Promise<WithId<Project>[]> {
    if (tags.length != 0) {
      return (
        await this.projects.find({
          $text: {
            $search: tags.join(" "),
          },
          private: false,
          deleted_at: {
            $exists: false,
          },
        })
      ).toArray();
    }

    return (
      await this.projects.find({
        private: false,
        deleted_at: {
          $exists: false,
        },
      })
    ).toArray();
  }
  
  async update(slug: string, project: MatchKeysAndValues<Project>): Promise<void> {
    await this.projects.updateOne({
      slug: slug
    }, {
      $set: project
    });
  }

  async delete(slug: string): Promise<void> {
    this.projects.updateOne(
      {
        slug: slug,
      },
      {
        $set: {
          deleted_at: new Date(),
        },
      },
    );
  }
}
