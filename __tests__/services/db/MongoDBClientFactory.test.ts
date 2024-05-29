import { MongoDBConnection } from "@/services/db/MongoDBConnection";
import { PortfolioDatabaseFactory } from "@/services/db/PortfolioDatabaseFactory";
import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";
import { EnvironmentSettingDictionary } from "@/services/settings/EnvironmentSettingDictionary";

import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(
  config({
    path: [".env"],
  }),
);

const environment_setting_dictionary = new EnvironmentSettingDictionary(
  process.env,
);

const portfolio_database_factory = new PortfolioDatabaseFactory(
  environment_setting_dictionary.database,
);
const mongo_connection = new MongoDBConnection<PortfolioDatabase>(
  environment_setting_dictionary.database_connection_string,
  portfolio_database_factory,
);

test("We can connect to the MongoDB client.", async () => {
  await mongo_connection.connect();

  expect(mongo_connection.connected());

  await mongo_connection.disconnect();
});
