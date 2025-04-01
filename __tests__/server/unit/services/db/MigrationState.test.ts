import { Migration } from "@/services/db/Migration";
import { MigrationState } from "@/services/db/MigrationState";
import { test, describe } from "@jest/globals";

test("migrations throw error on date format that is to long", () => {
  const create_migration = () => {
    new Migration("2024050560701_testing_this", "./");
  };

  expect(create_migration).toThrow(Error);
});

test("migrations throw error on date format that includes non-numbers", () => {
  const create_migration = () => {
    new Migration("202d0505a070_testing_this", "./");
  };

  expect(create_migration).toThrow(Error);
});

test("migrations have correct time format", () => {
  const migration = new Migration(
    "202404162020_testing_this",
    "./202404162020_testing_this",
  );
  expect(migration.date).toEqual(new Date("2024-04-16T20:20"));
});

test("running the correct migrations when we set a specific state", () => {
  const migrations = [
    new Migration("202404162020_testing_one", "/202404162020_testing_one"),
    new Migration("202404162021_testing_two", "/202404162021_testing_two"),
    new Migration("202404162022_testing_three", "/202404162022_testing_three"),
  ];

  const migration_state = new MigrationState(
    migrations,
    "202404162021_testing_two",
  );
  const migrations_to_run = migration_state.pending_migrations;

  expect(migrations_to_run).toEqual(migrations.slice(2));
});

test("running all the migrations when we have no state set", () => {
  const migrations = [
    new Migration("202404162020_testing_one", "/202404162020_testing_one"),
    new Migration("202404162021_testing_two", "/202404162021_testing_two"),
    new Migration("202404162022_testing_three", "/202404162022_testing_three"),
  ];

  const migration_state = new MigrationState(migrations);
  const migrations_to_run = migration_state.pending_migrations;

  expect(migrations_to_run).toEqual(migrations);
});

test("running no migrations when at the end", () => {
  const migrations = [
    new Migration("202404162020_testing_one", "/202404162020_testing_one"),
    new Migration("202404162021_testing_two", "/202404162021_testing_two"),
    new Migration("202404162022_testing_three", "/202404162022_testing_three"),
  ];

  const migration_state = new MigrationState(
    migrations,
    "202404162022_testing_three",
  );
  const migrations_to_run = migration_state.pending_migrations;

  expect(migrations_to_run).toEqual([]);
});

test("not running migrations we have no migrations ran", () => {
  const migrations = [
    new Migration("202404162020_testing_one", "/202404162020_testing_one"),
    new Migration("202404162021_testing_two", "/202404162021_testing_two"),
    new Migration("202404162022_testing_three", "/202404162022_testing_three"),
  ];

  const migration_state = new MigrationState(
    migrations,
    "202404162021_testing_two",
  );
  const migrations_ran = migration_state.newly_ran_migrations;

  expect(migrations_ran).toEqual([]);
});

test("no pending migrations after running", () => {
  const migrations = [
    new Migration("202404162020_testing_one", "/202404162020_testing_one"),
    new Migration("202404162021_testing_two", "/202404162021_testing_two"),
    new Migration("202404162022_testing_three", "/202404162022_testing_three"),
  ];

  const migration_state = new MigrationState(migrations);
  for (const migration of migration_state.pending_migrations) {
    migration_state.markRan(migration);
  }
  const pending_migrations = migration_state.pending_migrations;

  expect(pending_migrations).toEqual([]);
});

test("returning the migrations ran", () => {
  const migrations = [
    new Migration("202404162020_testing_one", "/202404162020_testing_one"),
    new Migration("202404162021_testing_two", "/202404162021_testing_two"),
    new Migration("202404162022_testing_three", "/202404162022_testing_three"),
  ];

  const migration_state = new MigrationState(
    migrations,
    "202404162021_testing_two",
  );
  migration_state.markRan(migration_state.pending_migrations[0]);
  const migrations_ran = migration_state.newly_ran_migrations;

  expect(migrations_ran).toEqual(migrations.slice(2));
});
