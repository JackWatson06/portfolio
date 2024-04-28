import { MongoDBConnection } from "@/services/db/MongoDBConnection";
import { EnvironmentSettingDictionary } from "@/services/settings/EnvironmentSettingDictionary";
import { PortfolioDatabaseFactory } from "@/services/db/PortfolioDatabaseFactory";
import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { test } from "@jest/globals";

expand(
  config({
    path: [".env.test", ".env.local"],
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
