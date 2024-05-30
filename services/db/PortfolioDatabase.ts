import { MongoDBDatabase } from "./MongoDBDatabase";
import { type Project } from "./schemas/Project";
import { type Migration } from "./schemas/Migration";

import { Collection } from "mongodb";

export class PortfolioDatabase implements MongoDBDatabase {
  constructor(
    public projects: Collection<Project>,
    public migrations: Collection<Migration>,
  ) {}
}
