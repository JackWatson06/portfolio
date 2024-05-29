import { EnvironmentSettingDictionary } from "@/services/settings/EnvironmentSettingDictionary";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { test } from "@jest/globals";

expand(
  config({
    path: [".env"],
  }),
);

test("We can create a valid environment setting dictionary.", () => {
  const environment_setting_dictionary = new EnvironmentSettingDictionary({
    ...process.env,
    DATABASE: "testing",
  });
  expect(environment_setting_dictionary.database).toBe("testing");
});

test("We get an error when trying to create a environment setting dictionary with invalid settings..", () => {
  expect(
    () => new EnvironmentSettingDictionary({ DATABASE: undefined }),
  ).toThrow(Error);
});
