export interface SettingDictionary {
  readonly env: string;
  readonly database: string;
  readonly database_connection_string: string;
  readonly jwt_secret: string;
  readonly expires_offset: number;
  readonly salt: string;
  readonly admin_password: string;
}
