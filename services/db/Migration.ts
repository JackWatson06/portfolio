export class Migration {
  readonly date;

  constructor(
    readonly id: string,
    readonly path: string,
  ) {
    const migration_file_creation_date_string = this.id.split("_")[0];

    if (
      migration_file_creation_date_string.length != 12 ||
      !/^\d+$/.test(migration_file_creation_date_string)
    ) {
      throw new Error(
        `Migration file has invalid format. Migration File: ${id}`,
      );
    }

    const year = migration_file_creation_date_string.substring(0, 4);
    const month = migration_file_creation_date_string.substring(4, 6);
    const day = migration_file_creation_date_string.substring(6, 8);
    const hour = migration_file_creation_date_string.substring(8, 10);
    const minute = migration_file_creation_date_string.substring(10, 12);

    this.date = new Date(`${year}-${month}-${day}T${hour}:${minute}Z`);
  }
}
