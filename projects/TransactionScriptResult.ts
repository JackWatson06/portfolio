export enum ScriptResult {
  SUCCESS = 1,
  NOT_FOUND,
  DUPLICATE,
  INVALID,
}

export type SuccessfulScriptResult = {
  code: ScriptResult.SUCCESS;
};

export type SlugScriptResult = {
  code: ScriptResult.SUCCESS;
  slug: string;
};

export type NotFoundScriptResult = {
  code: ScriptResult.NOT_FOUND;
};

export type DuplicateResult = {
  code: ScriptResult.DUPLICATE;
};

export type InvalidScriptResult = {
  code: ScriptResult.INVALID;
  message: string;
};
