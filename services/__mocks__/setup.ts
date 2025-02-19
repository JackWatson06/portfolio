import {
  TEST_PROJECT_ONE,
  TEST_PROJECT_THREE,
  TEST_PROJECT_TWO,
} from "@/__tests__/seeding/projects/ProjectData";
import { ServiceResult } from "@/auth/login/LoginServiceResult";
import { PortfolioServiceLocator } from "@/services/PortfolioNodeServiceLocator";

function mockLoginTransactionScript() {
  return {
    login: jest.fn().mockImplementation((password: string) => {
      return new Promise((resolve) => {
        if (password != "testing") {
          return resolve({
            code: ServiceResult.INVALID,
          });
        }

        return resolve({
          code: ServiceResult.SUCCESS,
          token: "testing",
          expires: 10_000,
          secure: false,
        });
      });
    }),
  };
}

function mockPortfolioTransactionScript() {
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

function mockMediaTransactionScript() {
  return {
    upload: jest.fn(),
    read: jest.fn(),
    delete: jest.fn(),
  };
}

let portfolio_service_locator: PortfolioServiceLocator | null = null;
export const init = jest.fn().mockImplementation(() => {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  portfolio_service_locator = {
    login: mockLoginTransactionScript(),
    media: mockMediaTransactionScript(),
    project: mockPortfolioTransactionScript(),
  };
  return portfolio_service_locator;
});
export const free = () => {
  portfolio_service_locator = null;
};
