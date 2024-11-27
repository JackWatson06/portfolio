/**
 * Configuration file specifically for testing API endpoints.
 */

import jestConfig from "./jest.config";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

export default createJestConfig({
  ...jestConfig,
  testEnvironment: "@edge-runtime/jest-environment",
});
