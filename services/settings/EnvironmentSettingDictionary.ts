
import { SettingDictionary } from "./SettingDictionary";

type EnvironmentSettings = {
    [key: string]: string|undefined
}

export class EnvironmentSettingDictionary implements SettingDictionary {

    readonly database: string;
    readonly database_connection_string: string;

    constructor(environment_settings_key_value: EnvironmentSettings) {
        this.database = this.findEnvironmentSetting(environment_settings_key_value, 'DATABASE');
        this.database_connection_string = this.findEnvironmentSetting(environment_settings_key_value, 'DATABASE_CONNECTION_STRING');
    }

    private findEnvironmentSetting(environment_settings_key_value: EnvironmentSettings, setting_name: string): string {
        const setting = environment_settings_key_value[setting_name];
        
        if(setting === undefined) {
            throw new Error(`Environment settings does not have key: ${setting_name}`);
        }

        return setting;
    }
}
