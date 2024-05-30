import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";
import portfolio_service_locator from "@/services/setup";

import { exec as execSync } from "child_process";
import { promisify } from "util";

const exec = promisify(execSync);

const mongo_connection = portfolio_service_locator.mongo_connection;
let db: PortfolioDatabase;

beforeEach(async () => {
  await mongo_connection.connect();

  if (!mongo_connection.connected()) {
    throw new Error("Could not connect to the database.");
  }

  db = mongo_connection.db;
});

afterEach(async () => {
  await db.migrations.deleteMany({});
  await mongo_connection.disconnect();
});

test("We can migrate our database using database .ts files in the migrations folder.", async () => {
  const test_migrations_directory = `${__dirname}/test_migrations/`;
  await exec(`npm run migrate -- "${test_migrations_directory}"`);

  const migrations_cursors = await db.migrations.find({});
  const migrations = await migrations_cursors.toArray();
  expect(migrations.length).toEqual(1);
});

test("We do not run migrations when the migrations folder is missing.", async () => {
  const test_missing_migrations_directory = `${__dirname}/test_missing_migrations`;

  await exec(`npm run migrate -- "${test_missing_migrations_directory}"`);

  const migrations_cursors = await db.migrations.find({});
  const migrations = await migrations_cursors.toArray();
  expect(migrations).toEqual([]);
});
