import { Media } from "@/services/db/schemas/Media";
import { CollectionGateway } from "./CollectionGateway";
import { Collection, WithId } from "mongodb";

export class MediaGateway implements CollectionGateway {
  public constructor(private media: Collection<Media>) {}

  async insert(media: Media): Promise<void> {
    await this.media.insertOne(media);
  }

  async find(file_name: string): Promise<WithId<Media> | null> {
    return this.media.findOne(
      {
        file_name: file_name,
      },
      {
        sort: { uploaded_at: 1 },
      },
    );
  }

  async delete(file_name: string): Promise<void> {
    await this.media.deleteMany({
      file_name: file_name,
    });
  }
}
