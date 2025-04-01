export type MediaCreate = {
  file_name: string;
  content_type: string;
  size: number;
  data: Buffer;
};

export type MediaRead = {
  data: Buffer;
  hash: string;
  file_name: string;
  content_type: string;
  size: number;
  uploaded_at: Date;
};

export type MediaUploadParams = {
  upload: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
  public_url: string;
};
