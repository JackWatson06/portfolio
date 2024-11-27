import { PortfolioEdgeServiceLocator } from "../PortfolioEdgeServiceLocator";

function mock_token_transaction_script() {
  return {
    validate: jest
      .fn()
      .mockImplementation((token: string) => token == "testing"),
  };
}

let portfolio_service_locator: PortfolioEdgeServiceLocator | null = null;
export const init = jest.fn().mockImplementation(() => {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  portfolio_service_locator = {
    token: mock_token_transaction_script(),
  };
  return portfolio_service_locator;
});
export const free = () => {
  portfolio_service_locator = null;
};
