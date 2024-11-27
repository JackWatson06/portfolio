export enum ScriptResult {
  SUCCESS = 1,
  INVALID,
}

export type SuccessfulScriptResult = {
  code: ScriptResult.SUCCESS;
  token: string;
  secure: boolean;
  expires: number;
};

export type InvalidScriptResult = {
  code: ScriptResult.INVALID;
};
