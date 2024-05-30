import { MongoDBDatabase } from "./MongoDBDatabase";

import { MongoClient } from "mongodb";

export interface MongoDBDatabaseFactory<Schema extends MongoDBDatabase> {
  build(mongo_client: MongoClient): Promise<Schema>;
}
