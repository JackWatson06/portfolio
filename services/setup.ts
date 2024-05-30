import { EnvironmentSettingDictionary } from "./settings/EnvironmentSettingDictionary";
import { MongoDBConnection } from "./db/MongoDBConnection";
import { PortfolioDatabase } from "./db/PortfolioDatabase";
import { PortfolioDatabaseFactory } from "./db/PortfolioDatabaseFactory";
import { LocalFileSystem } from "./file-system/LocalFileSystem";
import { Logger } from "./logging/Logger";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { PortfolioServiceLocator } from "./PortfolioServiceLocator";
import { PortfolioLogger } from "./logging/PortfolioLogger";

function buildMongoConnection(environment_settings_dictionary: EnvironmentSettingDictionary) {
  const portfolio_database_factory = new PortfolioDatabaseFactory(
    environment_settings_dictionary.database,
  );
  return new MongoDBConnection<PortfolioDatabase>(
    environment_settings_dictionary.database_connection_string,
    portfolio_database_factory,
  );
}

function buildLocalFileSystem() {
  return new LocalFileSystem();
}

function buildPortfolioLogger(){
  return new PortfolioLogger('portfolio');
}

expand(
  config({
    path: [".env"],
  }),
);

const environment_settings_dictionary = new EnvironmentSettingDictionary(
  process.env,
);

const portfolio_service_locator = new PortfolioServiceLocator(
  buildMongoConnection(environment_settings_dictionary),
  buildLocalFileSystem(),
  buildPortfolioLogger()
);

export default portfolio_service_locator;
