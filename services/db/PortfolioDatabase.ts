import { MongoDBDatabase } from "./MongoDBDatabase";
import { type Project } from "./schemas/Project";
import { type Migration } from "./schemas/Migration";
import { type Media } from "./schemas/Media";

import { Collection } from "mongodb";

export class PortfolioDatabase implements MongoDBDatabase {
  constructor(
    public projects: Collection<Project>,
    public media: Collection<Media>,
    public migrations: Collection<Migration>,
  ) {}
}
