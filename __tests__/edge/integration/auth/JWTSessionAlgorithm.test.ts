import { JWTSessionAlgorithm } from "@/auth/services/JWTSessionAlgorithm";

test("we can create a new token.", async () => {
  const JWT_session_algo = new JWTSessionAlgorithm(
    "testingD5CZxRt4o3XZirZFUcB8Eopee3VM6ala",
  );

  const token = await JWT_session_algo.create(10_000);

  expect(token.length).not.toBe(0);
});

test("we can validate a token.", async () => {
  const JWT_session_algo = new JWTSessionAlgorithm(
    "D5CZxRt4o3XZirZFUcB8Eopee3VM6ala",
  );

  const valid_token = await JWT_session_algo.create(Date.now() + 1_000_000_000);

  expect(await JWT_session_algo.validate(valid_token)).toBe(true);
});