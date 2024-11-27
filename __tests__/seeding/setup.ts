import { MongoDBConnection } from "@/services/db/MongoDBConnection";
import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";
import { PortfolioDatabaseFactory } from "@/services/db/PortfolioDatabaseFactory";
import { EnvironmentSettingDictionary } from "@/services/settings/EnvironmentSettingDictionary";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

export function buildMongoConnection() {
  expand(
    config({
      path: [".env"],
    }),
  );

  const environment_settings_dictionary = new EnvironmentSettingDictionary(
    process.env,
  );

  const portfolio_database_factory = new PortfolioDatabaseFactory(
    environment_settings_dictionary.database,
  );
  return new MongoDBConnection<PortfolioDatabase>(
    environment_settings_dictionary.database_connection_string,
    portfolio_database_factory,
  );
}
