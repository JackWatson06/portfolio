import { load_from_file } from "@/services/settings/load-env-file";

test("we load node environment settings from an .env file.", () => {
  const env = load_from_file(`${__dirname}/env.txt`);

  expect(env.TESTING).toBe("testing");
});

test("we expand the environment settings we load.", () => {
  const env = load_from_file("env.txt");

  expect(env.TESTING_THREE).toBe("testing,testing_two");
});
