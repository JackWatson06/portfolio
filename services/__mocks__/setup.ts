import {
  TEST_PROJECT_ONE,
  TEST_PROJECT_THREE,
  TEST_PROJECT_TWO,
} from "@/__tests__/seeding/projects/ProjectData";
import { ScriptResult } from "@/auth/login/TransactionScriptResult";
import { PortfolioServiceLocator } from "@/services/PortfolioNodeServiceLocator";

function mock_login_transaction_script() {
  return {
    login: jest.fn().mockImplementation((password: string) => {
      return new Promise((resolve) => {
        if (password != "testing") {
          return resolve({
            code: ScriptResult.INVALID,
          });
        }

        return resolve({
          code: ScriptResult.SUCCESS,
          token: "testing",
          expires: 10_000,
          secure: false,
        });
      });
    }),
  };
}

function mock_portfolio_transaction_script() {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findPublic: jest.fn(),
    findAll: jest.fn().mockImplementation(() => {
      return [
        { ...TEST_PROJECT_ONE },
        { ...TEST_PROJECT_TWO },
        { ...TEST_PROJECT_THREE },
      ];
    }),
    findAllPublic: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

let portfolio_service_locator: PortfolioServiceLocator | null = null;
export const init = jest.fn().mockImplementation(() => {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  portfolio_service_locator = {
    login: mock_login_transaction_script(),
    project: mock_portfolio_transaction_script(),
  };
  return portfolio_service_locator;
});
export const free = () => {
  portfolio_service_locator = null;
};
