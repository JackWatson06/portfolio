import { BlobStorage, UploadHTTPParams } from "./BlobStorage";

type AuthorizationAccountResponse = {
  apiInfo: {
    storageApi: {
      downloadUrl: string;
      apiUrl: string;
    };
  };
  authorizationToken: string;
};

type UploadUrlResponse = {
  authorizationToken: string;
  uploadUrl: string;
};

export class BackBlazeBlobStorage implements BlobStorage {
  constructor(
    private app_key_id: string,
    private app_key: string,
    private bucket_id: string,
    private bucket_name: string,
  ) {}

  async generateHTTPParams(sha1: string): Promise<UploadHTTPParams> {
    const basic_authorization_header = `Basic ${Buffer.from(
      `${this.app_key_id}:${this.app_key}`,
    ).toString("base64")}`;

    const authorize_account_response = await fetch(
      "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
      {
        headers: {
          Authorization: basic_authorization_header,
        },
      },
    );

    const authorize_account_response_body: AuthorizationAccountResponse =
      await authorize_account_response.json();
    const download_endpoint =
      authorize_account_response_body.apiInfo.storageApi.downloadUrl;
    const api_endpoint =
      authorize_account_response_body.apiInfo.storageApi.apiUrl;
    const auth_key = authorize_account_response_body.authorizationToken;

    const get_upload_url_response = await fetch(
      `${api_endpoint}/b2api/v3/b2_get_upload_url?bucketId=${this.bucket_id}`,
      {
        headers: {
          Authorization: auth_key,
        },
      },
    );
    const get_upload_url_response_body: UploadUrlResponse =
      await get_upload_url_response.json();

    return {
      upload: {
        url: get_upload_url_response_body.uploadUrl,
        method: "POST",
        headers: {
          Authorization: get_upload_url_response_body.authorizationToken,
          "X-Bz-File-Name": sha1,
          "X-Bz-Content-Sha1": sha1,
          "X-Bz-Info-b2-content-disposition": "inline",
          "X-Bz-Info-b2-content-language": "en-US",
        },
      },
      public_url: `${download_endpoint}/file/${this.bucket_name}/${sha1}`,
    };
  }
  removeBlob(file_name: string): void {}
}
