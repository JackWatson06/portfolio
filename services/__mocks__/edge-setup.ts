import { PortfolioEdgeServiceLocator } from "../PortfolioEdgeServiceLocator";

function mockTokenTransactionScript() {
  return {
    validate: jest
      .fn()
      .mockImplementation((token: string) => token == "testing"),
  };
}

let portfolio_service_locator: PortfolioEdgeServiceLocator | null = null;
export let environment: string | null = "development";
export const init = jest.fn().mockImplementation(() => {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  portfolio_service_locator = {
    token: mockTokenTransactionScript(),
  };
  return portfolio_service_locator;
});
export const free = () => {
  portfolio_service_locator = null;
};
