import { MongoDBConnection } from "./db/MongoDBConnection";
import { PortfolioDatabase } from "./db/PortfolioDatabase";
import { LocalFileSystem } from "./file-system/LocalFileSystem";
import { Logger } from "./logging/Logger";

export interface ServiceLocator {
  mongo_connection: MongoDBConnection<PortfolioDatabase>;
  local_file_system: LocalFileSystem;
  logger: Logger;
}
