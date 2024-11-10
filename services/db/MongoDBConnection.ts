import { MongoDBDatabaseFactory } from "./MongoDBDatabaseFactory";
import { MongoDBDatabase } from "./MongoDBDatabase";

import { MongoClient, ServerApiVersion } from "mongodb";

interface DatabaseConnected<Schema> {
  db: Schema;
}

export class MongoDBConnection<Schema extends MongoDBDatabase> {
  private primary_db: Schema | null = null;

  private database_factory;

  private client;

  constructor(
    database_connection_string: string,
    database_factory: MongoDBDatabaseFactory<Schema>,
  ) {
    this.database_factory = database_factory;
    this.client = new MongoClient(database_connection_string, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
    });
  }

  public async connect() {
    await this.client.connect();
    this.primary_db = await this.database_factory.build(this.client);
  }

  public connected(): this is DatabaseConnected<Schema> {
    return this.primary_db != null;
  }

  public async disconnect() {
    await this.client.close();
  }

  get db(): Schema | null {
    return this.primary_db;
  }
}
