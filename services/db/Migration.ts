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

    const year = parseInt(migration_file_creation_date_string.substring(0, 4));
    const month = parseInt(migration_file_creation_date_string.substring(4, 6));
    const day = parseInt(migration_file_creation_date_string.substring(6, 8));
    const hour = parseInt(migration_file_creation_date_string.substring(8, 10));
    const minute = parseInt(
      migration_file_creation_date_string.substring(10, 12),
    );

    const date = new Date();

    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    this.date = date;
  }
}
