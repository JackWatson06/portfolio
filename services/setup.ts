import { AuthTransactionScript } from "@/auth/AuthTransactionScript";
import { PortfolioServiceLocator } from "./PortfolioServiceLocator";
import { MongoDBConnection } from "./db/MongoDBConnection";
import { PortfolioDatabase } from "./db/PortfolioDatabase";
import { PortfolioDatabaseFactory } from "./db/PortfolioDatabaseFactory";
import { LocalFileSystem } from "./file-system/LocalFileSystem";
import { PortfolioLogger } from "./logging/PortfolioLogger";
import { EnvironmentSettingDictionary } from "./settings/EnvironmentSettingDictionary";

import { JWTSessionAlgorithm } from "@/auth/JWTSessionAlgorithm";
import { PortfolioHashingAlgorithm } from "@/auth/PortfolioHashingAlgorithm";
import { ProjectValidator } from "@/projects/ProjectValidator";
import { ProjectsGateway } from "@/projects/ProjectsGateway";
import { ProjectsTransactionScript } from "@/projects/ProjectsTransactionScript";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { Collection } from "mongodb";
import { Project } from "./db/schemas/Project";
import { ExpiresDateTimeCalculator } from "@/auth/ExpiresDateTimeCalculator";

function buildEnvironmentSettingsDictionary() {
  expand(
    config({
      path: [".env"],
    }),
  );

  return new EnvironmentSettingDictionary(process.env);
}

function buildMongoConnection(
  environment_settings_dictionary: EnvironmentSettingDictionary,
) {
  const portfolio_database_factory = new PortfolioDatabaseFactory(
    environment_settings_dictionary.database,
  );
  return new MongoDBConnection<PortfolioDatabase>(
    environment_settings_dictionary.database_connection_string,
    portfolio_database_factory,
  );
}

function buildLocalFileSystem() {
  return new LocalFileSystem();
}

function buildPortfolioLogger() {
  return new PortfolioLogger("portfolio");
}

function buildAuthTransactionScript(
  environment_settings_dictionary: EnvironmentSettingDictionary,
) {
  const session_algorithm = new JWTSessionAlgorithm(
    environment_settings_dictionary.jwt_secret,
  );
  const hasing_algorithm = new PortfolioHashingAlgorithm(
    environment_settings_dictionary.salt,
  );
  const expires_calculator = new ExpiresDateTimeCalculator(
    environment_settings_dictionary.expires_offset,
  );

  return new AuthTransactionScript(
    {
      hashed_password: environment_settings_dictionary.admin_password,
      environment: environment_settings_dictionary.env
    },
    session_algorithm,
    hasing_algorithm,
    expires_calculator
  );
}

function buildProjectsTransactionScript(projects: Collection<Project>) {
  const project_gateway = new ProjectsGateway(projects);
  const project_validator = new ProjectValidator();

  return new ProjectsTransactionScript(project_validator, project_gateway);
}

const environment_settings_dictionary = buildEnvironmentSettingsDictionary();
  const mongo_connection = buildMongoConnection(
    environment_settings_dictionary,
  );

export let portfolio_service_locator: PortfolioServiceLocator | null = null;
export async function init() {
  if(portfolio_service_locator != null) {
    return;
  }

  await mongo_connection.connect();

  if (!mongo_connection.connected()) {
    throw new Error("Error trying to connect to MongoDB.");
  }

  portfolio_service_locator = new PortfolioServiceLocator(
    buildAuthTransactionScript(environment_settings_dictionary),
    buildProjectsTransactionScript(mongo_connection.db.projects),
  );
}
export async function free() {
  await mongo_connection.disconnect();
  portfolio_service_locator = null;
}