import { MediaScriptInstrumentation } from "../MediaScriptInstrumentation";

export class MockMediaScriptInstrumentation
  implements MediaScriptInstrumentation
{
  public upload_failed: string | null = null;
  public missing_file_for_fetch: string | null = null;
  public fetch_failed: [string, string] | null = null;
  public missing_file_for_delete: string | null = null;
  public delete_failed: [string, string] | null = null;

  uploadFailed(e: string) {
    this.upload_failed = e;
  }

  missingFileForFetch(file_name: string) {
    this.missing_file_for_fetch = file_name;
  }

  fetchFailed(file_name: string, e: string) {
    this.fetch_failed = [file_name, e];
  }

  missingFileForDelete(file_name: string) {
    this.missing_file_for_delete = file_name;
  }

  deleteFailed(file_name: string, e: string) {
    this.delete_failed = [file_name, e];
  }

  reset() {
    this.upload_failed = null;
    this.missing_file_for_fetch = null;
    this.fetch_failed = null;
    this.missing_file_for_delete = null;
    this.delete_failed = null;
  }
}
