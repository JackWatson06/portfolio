import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { EnvironmentSettingDictionary } from "../settings/EnvironmentSettingDictionary";
import { MigrationStateRepository } from "./MigrationStateRepository";
import { MongoDBConnection } from "./MongoDBConnection";
import { PortfolioDatabase } from "./PortfolioDatabase";
import { PortfolioDatabaseFactory } from "./PortfolioDatabaseFactory";

function parseDirectoryParam(command_line_arguments: string[]) {
  if (command_line_arguments.length != 3) {
    return `${__dirname}/migrations/`;
  }

  return command_line_arguments[2];
}

function buildMongoConnection() {
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

(async () => {
  const mongo_connection = buildMongoConnection();
  await mongo_connection.connect();

  if (!mongo_connection.connected()) {
    throw new Error(
      "Could not connect to MongoDB database when running migrations.",
    );
  }

  const db = mongo_connection.db;
  const migrations_directory = parseDirectoryParam(process.argv);
  const migration_repository = new MigrationStateRepository(
    db,
    migrations_directory,
  );
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
