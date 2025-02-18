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

jest.mock("@/services/settings/load-env-file");
jest.mock("@/services/db/PortfolioDatabaseFactory");
jest.mock("@/services/db/MongoDBConnection");
jest.mock("@/services/fs/LocalFileSystem");
jest.mock("@/services/fs/Sha1FileHashingAlgorithm");
jest.mock("@/services/logging/PortfolioLogger");
jest.mock("@/auth/services/JWTSessionAlgorithm");
jest.mock("@/auth/login/PortfolioHashingAlgorithm");
jest.mock("@/auth/login/ExpiresDateTimeCalculator");
jest.mock("@/auth/login/LoginTransactionScript");
jest.mock("@/projects/ProjectValidator");
jest.mock("@/projects/ProjectsGateway");
jest.mock("@/projects/ProjectsTransactionScript");

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
