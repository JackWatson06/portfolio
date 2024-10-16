import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";

export default async function migrate(db: PortfolioDatabase): Promise<void> {
  await db.projects.createIndex(
    { tags: "text" },
  );
}
