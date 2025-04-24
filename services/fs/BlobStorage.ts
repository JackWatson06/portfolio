export type UploadHTTPParams = {
  upload: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
  public_url: string;
};

export enum BlobStorageResult {
  SUCCESS = 0,
  ERROR,
}

export interface BlobStorage {
  generateHTTPParams(sha1: string): Promise<UploadHTTPParams>;
  removeBlob(file_name: string): Promise<BlobStorageResult>;
}
