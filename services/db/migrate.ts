import { EnvironmentSettingDictionary } from "../settings/EnvironmentSettingDictionary";
import { MongoDBConnection } from "./MongoDBConnection";
import { PortfolioDatabase } from "./PortfolioDatabase";
import { PortfolioDatabaseFactory } from "./PortfolioDatabaseFactory";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { MigrationStateRepository } from "./MigrationStateRepository";

expand(
  config({
    path: [".env"],
  }),
);

console.log(process.env);
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

(async () => {
  await mongo_connection.connect();

  if (!mongo_connection.connected()) {
    throw new Error(
      "Could not connect to MongoDB database when running migrations.",
    );
  }

  const db = mongo_connection.db;
  const migration_repository = new MigrationStateRepository(db);
  const migration_state = await migration_repository.find();

  try {
    for (const pending_migration of migration_state.pending_migrations) {
      console.log(`=== Running migration: ${pending_migration.id}`);
      await (await import(pending_migration.path)).default(db);
      console.log(`=== Done Running migration: ${pending_migration.id}`);

      migration_state.markRan(pending_migration);
    }
  } catch (error) {
    console.error("Could not run migration. Error:", error);
  } finally {
    await migration_repository.save(migration_state);
  }

  process.exit();
})();
