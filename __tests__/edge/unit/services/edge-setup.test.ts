import { free, init } from "@/services/edge-setup";
import { PortfolioEdgeServiceLocator } from "@/services/PortfolioEdgeServiceLocator";
import { load_from_process } from "@/services/settings/load-env-file";
import { JWTSessionAlgorithm } from "@/auth/services/JWTSessionAlgorithm";

jest.mock("@/services/settings/load-env-file");
jest.mock("@/auth/services/JWTSessionAlgorithm");

beforeEach(() => {
  free();
});

test("we can initialize a edge service singleton once.", async () => {
  const service_locator = await init();
  const second_service_locator = await init();

  expect(second_service_locator).toBe(service_locator);
});

test("we return a service locator.", async () => {
  const service_locator = await init();

  expect(service_locator).toBeInstanceOf(PortfolioEdgeServiceLocator);
});

it.each([["gandalf"], ["bilbo"], ["frodo"]])(
  "we create token script using environment settings. Test case: %s",
  async (setting: string) => {
    const mock_load = load_from_process as jest.Mock;
    const current_env = load_from_process();

    mock_load.mockImplementation(() => ({
      ...current_env,
      JWT_SECRET: setting,
    }));

    await init();
    expect(JWTSessionAlgorithm).toHaveBeenCalledWith(setting);
  },
);

test("we load settings from the environment.", () => {
  expect(load_from_process).toHaveBeenCalled();
});

test("we can free the singleton.", () => {
  const service_locator = init();
  free();
  const second_service_locator = init();

  expect(second_service_locator).not.toBe(service_locator);
});
