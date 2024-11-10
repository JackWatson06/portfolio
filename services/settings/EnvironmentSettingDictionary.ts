import { SettingDictionary } from "./SettingDictionary";

type EnvironmentSettings = {
  [key: string]: string | undefined;
};

export class EnvironmentSettingDictionary implements SettingDictionary {
  readonly env: string;
  readonly database: string;
  readonly database_connection_string: string;
  readonly jwt_secret: string;
  readonly expires_offset: number;
  readonly salt: string;
  readonly admin_password: string;

  constructor(environment_settings_key_value: EnvironmentSettings) {
    this.env = this.findEnvironmentSetting(
      environment_settings_key_value,
      "NODE_ENV",
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
