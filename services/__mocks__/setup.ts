/**
 * TODO: Find a way to move these over to the class mocks that extend the interface. It will be
 * more consistent across the system.
 */

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

function mockTokenTransactionScript() {
  return {
    validate: jest
      .fn()
      .mockImplementation((token: string) => token == "testing"),
  };
}

function mockPortfolioTransactionScript() {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(TEST_PROJECT_ONE),
    findByName: jest.fn(),
    findPublic: jest.fn(),
    findAll: jest
      .fn()
      .mockReturnValue([
        { ...TEST_PROJECT_ONE },
        { ...TEST_PROJECT_TWO },
        { ...TEST_PROJECT_THREE },
      ]),
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

function mockMediaUploadTransactionScript() {
  return {
    findUploadParams: jest.fn(),
  };
}

let portfolio_service_locator: PortfolioServiceLocator | null = null;
export const init = jest.fn().mockImplementation(() => {
  if (portfolio_service_locator != null) {
    return portfolio_service_locator;
  }

  portfolio_service_locator = {
    login: mockLoginTransactionScript(),
    token: mockTokenTransactionScript(),
    media: mockMediaTransactionScript(),
    media_upload: mockMediaUploadTransactionScript(),
    project: mockPortfolioTransactionScript(),
  };
  return portfolio_service_locator;
});
export const free = () => {
  portfolio_service_locator = null;
};
