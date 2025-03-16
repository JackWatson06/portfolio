import { SettingDictionary } from "./SettingDictionary";

type EnvironmentSettings = {
  [key: string]: string | undefined;
};

export class EnvironmentSettingDictionary implements SettingDictionary {
  readonly env: string;
  readonly port: number;
  readonly database: string;
  readonly database_connection_string: string;
  readonly jwt_secret: string;
  readonly expires_offset: number;
  readonly salt: string;
  readonly admin_password: string;
  readonly local_blob_public_origin: string;
  readonly backblaze_app_key_id: string;
  readonly backblaze_app_key: string;
  readonly backblaze_bucket_id: string;
  readonly backblaze_bucket_name: string;

  constructor(environment_settings_key_value: EnvironmentSettings) {
    this.env = this.findEnvironmentSetting(
      environment_settings_key_value,
      "NODE_ENV",
    );
    this.port = Number(
      this.findEnvironmentSetting(environment_settings_key_value, "NEXT_PORT"),
    );
    this.database = this.findEnvironmentSetting(
      environment_settings_key_value,
      "MONGODB_DATABASE",
    );
    this.database_connection_string = this.findEnvironmentSetting(
      environment_settings_key_value,
      "MONGODB_URI",
    );
    this.jwt_secret = this.findEnvironmentSetting(
      environment_settings_key_value,
      "JWT_SECRET",
    );
    this.expires_offset = Number(
      this.findEnvironmentSetting(
        environment_settings_key_value,
        "EXPIRES_OFFSET",
      ),
    );
    this.salt = this.findEnvironmentSetting(
      environment_settings_key_value,
      "SALT",
    );
    this.admin_password = this.findEnvironmentSetting(
      environment_settings_key_value,
      "ADMIN_PASSWORD",
    );
    this.local_blob_public_origin = this.findEnvironmentSetting(
      environment_settings_key_value,
      "LOCAL_BLOB_PUBLIC_ORIGIN",
    );
    this.backblaze_app_key_id = this.findEnvironmentSetting(
      environment_settings_key_value,
      "BACKBLAZE_APP_KEY_ID",
    );
    this.backblaze_app_key = this.findEnvironmentSetting(
      environment_settings_key_value,
      "BACKBLAZE_APP_KEY",
    );
    this.backblaze_bucket_id = this.findEnvironmentSetting(
      environment_settings_key_value,
      "BACKBLAZE_BUCKET_ID",
    );
    this.backblaze_bucket_name = this.findEnvironmentSetting(
      environment_settings_key_value,
      "BACKBLAZE_BUCKET_NAME",
    );
  }

  private findEnvironmentSetting(
    environment_settings_key_value: EnvironmentSettings,
    setting_name: string,
  ): string {
    const setting = environment_settings_key_value[setting_name];

    if (setting === undefined) {
      throw new Error(
        `Environment settings does not have key: ${setting_name}`,
      );
    }

    return setting;
  }
}
