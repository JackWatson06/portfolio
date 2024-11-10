/**
 * Configuration file specifically for testing page rendering on the frontend.
 */

import jestConfig from "./jest.config";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

export default createJestConfig({
  ...jestConfig,
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/app-client/**/*.[jt]s?(x)"],
});
