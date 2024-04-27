import { Migration } from "./Migration";

export class MigrationState {
  private ran: Migration[] = [];

  private pending: Migration[];

  constructor(
    private all_migrations: Migration[],
    private last_ran_migration_id: string = "",
  ) {
    if (last_ran_migration_id === "") {
      this.pending = all_migrations;
      return;
    }

    const index = this.all_migrations.findIndex(
      (migration) => migration.id === this.last_ran_migration_id,
    );

    if (index === -1) {
      this.pending = [];
      return;
    }

    this.pending = this.all_migrations.slice(index + 1);
  }

  public markRan(ran_migration: Migration): void {
    const index = this.pending.findIndex(
      (migration) => migration.id === ran_migration.id,
    );

    const removed_migration = this.pending.splice(index, 1);

    if (removed_migration.length === 0) {
      return;
    }

    this.ran.push(removed_migration[0]);
  }

  get newly_ran_migrations() {
    return this.ran;
  }

  get pending_migrations() {
    return [...this.pending];
  }
}
