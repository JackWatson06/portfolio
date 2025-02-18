import { JWTSessionAlgorithm } from "@/auth/services/JWTSessionAlgorithm";
import { TokenTransactionScript } from "@/auth/token/TokenTransactionScript";
import { PortfolioEdgeServiceLocator } from "./PortfolioEdgeServiceLocator";
import { EnvironmentSettingDictionary } from "./settings/EnvironmentSettingDictionary";
import { load_from_process } from "./settings/load-env-file";

function buildEnvironmentSettingsDictionary() {
  return new EnvironmentSettingDictionary(load_from_process());
}

function buildTokenTransactionScript(
  environment_settings_dictionary: EnvironmentSettingDictionary,
) {
  return new TokenTransactionScript(
    new JWTSessionAlgorithm(environment_settings_dictionary.jwt_secret),
  );
}

let portfolio_service_locator: PortfolioEdgeServiceLocator | null = null;
export function init(): PortfolioEdgeServiceLocator {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  const environment_settings_dictionary = buildEnvironmentSettingsDictionary();
  portfolio_service_locator = new PortfolioEdgeServiceLocator(
    buildTokenTransactionScript(environment_settings_dictionary),
  );
  return portfolio_service_locator;
}

export function free() {
  portfolio_service_locator = null;
}
