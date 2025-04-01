import { Logger } from "@/services/logging/Logger";
import { MediaScriptInstrumentation } from "./MediaScriptInstrumentation";

const MEDIA_LOG_NAMESPACE = "Media::MediaService::ERROR";

export class MediaScriptLoggerInstrumentation
  implements MediaScriptInstrumentation
{
  constructor(private logger: Logger) {}

  uploadFailed(e: string) {
    this.logger.error(`${MEDIA_LOG_NAMESPACE}::upload:Failed - Error: ${e}`);
  }
  missingFileForFetch(file_name: string) {
    this.logger.error(
      `${MEDIA_LOG_NAMESPACE}::read::MissingFile - File Name: ${file_name}`,
    );
  }
  fetchFailed(file_name: string, e: string) {
    this.logger.error(
      `${MEDIA_LOG_NAMESPACE}::read::Failed - File Name: ${file_name}, Error: ${e}`,
    );
  }
  missingFileForDelete(file_name: string) {
    this.logger.error(
      `${MEDIA_LOG_NAMESPACE}::delete::MissingFile - File Name: ${file_name}`,
    );
  }
  deleteFailed(file_name: string, e: string) {
    this.logger.error(
      `${MEDIA_LOG_NAMESPACE}::delete::Failed - File Name: ${file_name}, Error: ${e}`,
    );
  }
}
