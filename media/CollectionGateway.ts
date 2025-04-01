import { Media } from "@/services/db/schemas/Media";
import { WithId } from "mongodb";

export interface CollectionGateway {
  insert(media: Media): Promise<void>;
  find(file_name: string): Promise<WithId<Media> | null>;
  delete(file_name: string): Promise<void>;
}
