import { config } from "dotenv";
import { expand } from "dotenv-expand";

type EnvironmentVariables = {
  [env_key: string]: string|undefined
}

export function load_from_file(env_file: string): EnvironmentVariables {
  expand(
    config({
      path: [env_file],
    }),
  );

  return process.env
}

export function load_from_process(): EnvironmentVariables {
  return process.env
}
