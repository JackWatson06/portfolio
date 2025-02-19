export type MediaUploadParams = {
  upload: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
  public_url: string;
};
