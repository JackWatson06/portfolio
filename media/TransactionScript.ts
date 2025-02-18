import {
  NotFoundScriptResult,
  ServiceErrorScriptResult,
  SuccessfulScriptResult,
} from "./TransactionScriptResult";
import { MediaCreate, MediaRead } from "./DTOSchema";

export interface TransactionScript {
  upload(
    media_create: MediaCreate,
  ): Promise<SuccessfulScriptResult | ServiceErrorScriptResult>;

  read(file_name: string): Promise<MediaRead | null>;
  delete(
    file_name: string,
  ): Promise<
    SuccessfulScriptResult | NotFoundScriptResult | ServiceErrorScriptResult
  >;
}
