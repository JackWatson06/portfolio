import { MockSessionAlgorithm } from "@/auth/services/__mocks__/MockSessionAlgorithm";
import { LoginTransactionScript } from "@/auth/login/LoginTransactionScript";
import { ExpiresCalculator } from "@/auth/login/ExpiresCalculator";
import { HashingAlgorithm } from "@/auth/login/HashingAlgorithm";
import { ServiceResult } from "@/auth/login/LoginServiceResult";

class TestHashingAlgorithm implements HashingAlgorithm {
  hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return resolve("testing");
    });
  }
}

class TestExpiresCalculator implements ExpiresCalculator {
  getExpirationTime(): number {
    return 10_000;
  }
}

test("we can create a new authentication token.", async () => {
  const auth_script = new LoginTransactionScript(
    {
      hashed_password: "testing",
      environment: "production",
    },
    new MockSessionAlgorithm(),
    new TestHashingAlgorithm(),
    new TestExpiresCalculator(),
  );

  const auth_script_result = await auth_script.login("testing");
  expect(auth_script_result.code).toBe(ServiceResult.SUCCESS);
});

test("we get error when login is invalid.", async () => {
  const auth_script = new LoginTransactionScript(
    {
      hashed_password: "testing_invalid",
      environment: "production",
    },
    new MockSessionAlgorithm(),
    new TestHashingAlgorithm(),
    new TestExpiresCalculator(),
  );

  const auth_script_result = await auth_script.login("testing");
  expect(auth_script_result.code).toBe(ServiceResult.INVALID);
});
