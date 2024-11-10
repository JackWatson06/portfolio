import { AuthTransactionScript } from "@/auth/AuthTransactionScript";
import { ExpiresCalculator } from "@/auth/ExpiresCalculator";
import { HashingAlgorithm } from "@/auth/HashingAlgorithm";
import { SessionAlgorithm } from "@/auth/SessionAlgorithm";
import { ScriptResult } from "@/auth/TransactionScriptResult";

class TestHashingAlgorithm implements HashingAlgorithm {
  hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return resolve("testing");
    });
  }
}

class TestSessionAlgorithm implements SessionAlgorithm {
  constructor(private valid_token: string) {}

  async create(): Promise<string> {
    return new Promise((resolve) => {
      resolve("testing");
    });
  }
  async validate(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.valid_token == token);
    });
  }
}

class TestExpiresCalculator implements ExpiresCalculator {
  getExpirationTime(): number {
    return 10_000;
  }
}

test("we can create a new authentication token.", async () => {
  const auth_script = new AuthTransactionScript(
    {
      hashed_password: "testing",
      environment: "production",
    },
    new TestSessionAlgorithm("testing"),
    new TestHashingAlgorithm(),
    new TestExpiresCalculator(),
  );

  const auth_script_result = await auth_script.login("testing");
  expect(auth_script_result.code).toBe(ScriptResult.SUCCESS);
});

test("we get error when login is invalid.", async () => {
  const auth_script = new AuthTransactionScript(
    {
      hashed_password: "testing_invalid",
      environment: "production",
    },
    new TestSessionAlgorithm("testing"),
    new TestHashingAlgorithm(),
    new TestExpiresCalculator(),
  );

  const auth_script_result = await auth_script.login("testing");
  expect(auth_script_result.code).toBe(ScriptResult.INVALID);
});

test("we can validate a token.", async () => {
  const auth_script = new AuthTransactionScript(
    {
      hashed_password: "testing",
      environment: "production",
    },
    new TestSessionAlgorithm("testing"),
    new TestHashingAlgorithm(),
    new TestExpiresCalculator(),
  );

  const validation_result = await auth_script.validateSession("testing");
  expect(validation_result).toBe(true);
});

test("we return false when token is invalid.", async () => {
  const auth_script = new AuthTransactionScript(
    {
      hashed_password: "testing",
      environment: "production",
    },
    new TestSessionAlgorithm("testing"),
    new TestHashingAlgorithm(),
    new TestExpiresCalculator(),
  );

  expect(await auth_script.validateSession("testing_invalid")).toBe(false);
});
