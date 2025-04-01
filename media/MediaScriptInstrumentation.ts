export interface MediaScriptInstrumentation {
  uploadFailed(e: string): void;
  missingFileForFetch(file_name: string): void;
  fetchFailed(file_name: string, e: string): void;
  missingFileForDelete(file_name: string): void;
  deleteFailed(file_name: string, e: string): void;
}
