import { ExpiresDateTimeCalculator } from "@/auth/ExpiresDateTimeCalculator";

test("we get a future time.", async () => {
  const now = Date.now() + 10_000
  const expires_datetime_calculator = new ExpiresDateTimeCalculator(10_000);

  expect(expires_datetime_calculator.getExpirationTime()).toBeGreaterThanOrEqual(now);
});


