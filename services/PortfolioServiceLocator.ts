import { MongoDBConnection } from "./db/MongoDBConnection";
import { PortfolioDatabase } from "./db/PortfolioDatabase";
import { LocalFileSystem } from "./file-system/LocalFileSystem";
import { Logger } from "./logging/Logger";
import { ServiceLocator } from "./ServiceLocator";

export class PortfolioServiceLocator implements ServiceLocator {
  constructor(
    readonly mongo_connection: MongoDBConnection<PortfolioDatabase>,
    readonly local_file_system: LocalFileSystem,
    readonly logger: Logger,
  ) {}
}
