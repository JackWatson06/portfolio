import { MockSessionAlgorithm } from "@/auth/services/__mocks__/MockSessionAlgorithm";
import { TokenTransactionScript } from "@/auth/token/TokenTransactionScript";

test("we can validate a token.", async () => {
  const token_script = new TokenTransactionScript(
    new MockSessionAlgorithm(),
  );

  expect(await token_script.validate("testing")).toBe(true);
});

test("we return false when token is invalid.", async () => {
  const token_script = new TokenTransactionScript(
    new MockSessionAlgorithm(),
  );

  expect(await token_script.validate("testing_invalid")).toBe(false);
});

test("we validate against the session service.", async () => {
  const mock_session = new MockSessionAlgorithm();
  const token_script = new TokenTransactionScript(
    mock_session,
  );

  await token_script.validate("testing");
  expect(mock_session.validate).toHaveBeenCalled();
});