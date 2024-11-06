import { JWTSessionAlgorithm } from "@/auth/JWTSessionAlgorithm";

test("we can create a new token.", async () => {
  const JWT_session_algo = new JWTSessionAlgorithm(
    "testingD5CZxRt4o3XZirZFUcB8Eopee3VM6ala"
  );

  const token = await JWT_session_algo.create(10_000);

  expect(token.length).not.toBe(0);
});

test("we can validate a token.", async () => {
  const JWT_session_algo = new JWTSessionAlgorithm(
    "D5CZxRt4o3XZirZFUcB8Eopee3VM6ala"
  );

  const valid_token = await JWT_session_algo.create(Date.now() + 1_000_000_000);

  expect(await JWT_session_algo.validate(valid_token)).toBe(true);
});

test("an expired token is invalid.", async () => {
  const JWT_session_algo = new JWTSessionAlgorithm(
    "D5CZxRt4o3XZirZFUcB8Eopee3VM6ala"
  );

  const valid_token = await JWT_session_algo.create(10_000);

  expect(await JWT_session_algo.validate(valid_token)).toBe(false);
})

test("we can validate a invalid token.", async () => {
  const JWT_session_algo = new JWTSessionAlgorithm(
    "D5CZxRt4o3XZirZFUcB8Eopee3VM6ala"
  );
  const JWT_session_algo_two = new JWTSessionAlgorithm(
    "jWfhx8IvheaXTYrnn9LSpcFTgXwpLElF"
  );

  const invalid_token = await JWT_session_algo_two.create(10_000);
  expect(await JWT_session_algo.validate(invalid_token)).toBe(false);
});
