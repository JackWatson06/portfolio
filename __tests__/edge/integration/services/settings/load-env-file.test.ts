import { load_from_process } from "@/services/settings/load-env-file";

test("we load from process.env in edge runtime.", () => {
  process.env.TESTING = "testing";

  const env_vars = load_from_process();
  expect(env_vars.TESTING).toBe("testing");
});
