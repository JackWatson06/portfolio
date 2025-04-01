import { EnvironmentSettingDictionary } from "@/services/settings/EnvironmentSettingDictionary";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { test } from "@jest/globals";

expand(
  config({
    path: [".env"],
  }),
);

test("creating a valid environment setting dictionary", () => {
  const environment_setting_dictionary = new EnvironmentSettingDictionary({
    ...process.env,
    MONGODB_DATABASE: "testing",
  });
  expect(environment_setting_dictionary.database).toBe("testing");
});

test("error when trying to create a environment setting dictionary with invalid settings", () => {
  expect(
    () => new EnvironmentSettingDictionary({ MONGODB_DATABASE: undefined }),
  ).toThrow(Error);
});
