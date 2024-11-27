import { LoginTransactionScript } from "@/auth/login/LoginTransactionScript";
import { PortfolioServiceLocator } from "./PortfolioNodeServiceLocator";
import { MongoDBConnection } from "./db/MongoDBConnection";
import { PortfolioDatabase } from "./db/PortfolioDatabase";
import { PortfolioDatabaseFactory } from "./db/PortfolioDatabaseFactory";
import { LocalFileSystem } from "./file-system/LocalFileSystem";
import { PortfolioLogger } from "./logging/PortfolioLogger";
import { EnvironmentSettingDictionary } from "./settings/EnvironmentSettingDictionary";

import { ExpiresDateTimeCalculator } from "@/auth/login/ExpiresDateTimeCalculator";
import { PortfolioHashingAlgorithm } from "@/auth/login/PortfolioHashingAlgorithm";
import { JWTSessionAlgorithm } from "@/auth/services/JWTSessionAlgorithm";
import { ProjectValidator } from "@/projects/ProjectValidator";
import { ProjectsGateway } from "@/projects/ProjectsGateway";
import { ProjectsTransactionScript } from "@/projects/ProjectsTransactionScript";
import { Collection } from "mongodb";
import { Project } from "./db/schemas/Project";
import { load_from_file } from "./settings/load-env-file";

function buildEnvironmentSettingsDictionary() {
  return new EnvironmentSettingDictionary(load_from_file(".env"));
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

function buildLoginTransactionScript(
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

  return new LoginTransactionScript(
    {
      hashed_password: environment_settings_dictionary.admin_password,
      environment: environment_settings_dictionary.env,
    },
    session_algorithm,
    hasing_algorithm,
    expires_calculator,
  );
}

function buildProjectsTransactionScript(projects: Collection<Project>) {
  const project_gateway = new ProjectsGateway(projects);
  const project_validator = new ProjectValidator();

  return new ProjectsTransactionScript(project_validator, project_gateway);
}

const environment_settings_dictionary = buildEnvironmentSettingsDictionary();
const mongo_connection = buildMongoConnection(environment_settings_dictionary);

let portfolio_service_locator: PortfolioServiceLocator | null = null;
export async function init(): Promise<PortfolioServiceLocator> {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  await mongo_connection.connect();

  if (!mongo_connection.connected()) {
    throw new Error("Error trying to connect to MongoDB.");
  }

  portfolio_service_locator = new PortfolioServiceLocator(
    buildLoginTransactionScript(environment_settings_dictionary),
    buildProjectsTransactionScript(mongo_connection.db.projects),
  );
  return portfolio_service_locator;
}
export async function free() {
  await mongo_connection.disconnect();
  portfolio_service_locator = null;
}
