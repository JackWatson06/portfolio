import { type MongoDBDatabaseFactory } from "./MongoDBDatabaseFactory";
import { PortfolioDatabase } from "./PortfolioDatabase";

import { MongoClient } from "mongodb";

export class PortfolioDatabaseFactory
  implements MongoDBDatabaseFactory<PortfolioDatabase>
{
  constructor(private database_name: string) {}

  async build(mongo_client: MongoClient): Promise<PortfolioDatabase> {
    const db = await mongo_client.db(this.database_name);

    return new PortfolioDatabase(
      db.collection("projects"),
      db.collection("media"),
      db.collection("migrations"),
    );
  }
}
