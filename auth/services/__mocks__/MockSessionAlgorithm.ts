import { SessionAlgorithm } from "../SessionAlgorithm";

export class MockSessionAlgorithm implements SessionAlgorithm {
  create = jest.fn();
  validate = jest
    .fn()
    .mockImplementation((token: string) => token == "testing");
}
