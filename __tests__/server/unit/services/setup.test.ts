// TODO reset all mocks before running tests in here. There's a dependency between tests that
// check for construction params and tests that run init();
// jest.resetAllMocks();

import { load_from_file } from "@/services/settings/load-env-file";
import {
  MongoDBConnection,
  // @ts-ignore : I am importing a jest mock function from __mocks__
  mockConnected,
  // @ts-ignore : I am importing a jest mock function from __mocks__
  mockDisconnected,
} from "@/services/db/MongoDBConnection";

import { free, init } from "@/services/setup";
import { PortfolioDatabaseFactory } from "@/services/db/PortfolioDatabaseFactory";
import { PortfolioHashingAlgorithm } from "@/auth/login/PortfolioHashingAlgorithm";
import { JWTSessionAlgorithm } from "@/auth/services/JWTSessionAlgorithm";
import { ExpiresDateTimeCalculator } from "@/auth/login/ExpiresDateTimeCalculator";
import { LoginTransactionScript } from "@/auth/login/LoginTransactionScript";
import { LocalBlobStorage } from "@/services/fs/LocalBlobStorage";

jest.mock("@/services/settings/load-env-file");
jest.mock("@/services/db/PortfolioDatabaseFactory");
jest.mock("@/services/db/MongoDBConnection");
jest.mock("@/services/fs/LocalFileSystem");
jest.mock("@/services/fs/Sha1FileHashingAlgorithm");
jest.mock("@/services/fs/LocalBlobStorage");
jest.mock("@/services/fs/BackBlazeBlobStorage");
jest.mock("@/services/logging/PortfolioLogger");
jest.mock("@/auth/services/JWTSessionAlgorithm");
jest.mock("@/auth/login/PortfolioHashingAlgorithm");
jest.mock("@/auth/login/ExpiresDateTimeCalculator");
jest.mock("@/auth/login/LoginTransactionScript");
jest.mock("@/projects/ProjectValidator");
jest.mock("@/projects/ProjectsGateway");
jest.mock("@/projects/ProjectTransactionScript");

beforeEach(() => {
  free();

  mockConnected.mockReturnValue(true);
});

test("load settings from a env file", () => {
  expect(load_from_file).toHaveBeenCalled();
});

test("init a service singleton once", async () => {
  const service_locator = await init();
  const second_service_locator = await init();

  expect(second_service_locator).toBe(service_locator);
});

test("init with invalid mongo connection", async () => {
  mockConnected.mockReturnValue(false);

  await expect(init()).rejects.toThrow(Error);
});

test("init database with environment variable", async () => {
  expect(PortfolioDatabaseFactory).toHaveBeenCalledWith("testing");
});

test("init Mongo connection with connection string", async () => {
  expect(MongoDBConnection).toHaveBeenCalledWith("testing", expect.anything());
});

test("init session algorithm with environment variable", () => {
  expect(JWTSessionAlgorithm).toHaveBeenCalledWith(
    "total_random_32_character_string",
  );
});

test("init hashing algorithm with environment variable", () => {
  expect(PortfolioHashingAlgorithm).toHaveBeenCalledWith("16_character_str");
});

test("init expires data time calculator with environment variable", () => {
  expect(ExpiresDateTimeCalculator).toHaveBeenCalledWith(604800000);
});

test("init login script with environment variables", () => {
  expect(LoginTransactionScript).toHaveBeenCalledWith(
    {
      hashed_password: "testing",
      environment: "testing",
    },
    expect.anything(),
    expect.anything(),
    expect.anything(),
  );
});

test("init local blob storage with environment variables", async () => {
  expect(LocalBlobStorage).toHaveBeenCalledWith(
    8080,
    "http://127.0.0.1:3000",
    expect.anything(),
  );
});

test("init back blaze blob with environment variables", async () => {
  const mocked_env_vars = load_from_file("testing");
  jest.resetModules();
  jest.doMock("@/services/settings/load-env-file", () => ({
    load_from_file: () => {
      return {
        ...mocked_env_vars,
        NODE_ENV: "production",
      };
    },
  }));
  const backblaze_module = await import("@/services/fs/BackBlazeBlobStorage");
  const mongo_connection_module = await import(
    "@/services/db/MongoDBConnection"
  );
  const setup_module = await import("@/services/setup");
  // @ts-ignore : I am importing a jest mock function from __mocks__
  mongo_connection_module.mockConnected.mockReturnValue(true);
  await setup_module.init();

  expect(backblaze_module.BackBlazeBlobStorage).toHaveBeenCalledWith(
    "test_app_key_id",
    "test_app_key",
    "test_bucket_id",
    "test_bucket_name",
  );
});

test("freeing the singleton", async () => {
  const service_locator = await init();
  await free();
  const second_service_locator = await init();

  expect(second_service_locator).not.toBe(service_locator);
});

test("disconnecting from the database", async () => {
  await init();
  await free();

  expect(mockDisconnected).toHaveBeenCalled();
});
