export enum ScriptResult {
  SUCCESS = 1,
  SERVICE_ERROR,
  NOT_FOUND,
}

export type SuccessfulScriptResult = {
  code: ScriptResult.SUCCESS;
};

export type ServiceErrorScriptResult = {
  code: ScriptResult.SERVICE_ERROR;
};

export type NotFoundScriptResult = {
  code: ScriptResult.NOT_FOUND;
};
