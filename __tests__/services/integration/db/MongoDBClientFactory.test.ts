import { buildMongoConnection } from "../../../setup";

const mongo_connection = buildMongoConnection();

test("We can connect to the MongoDB client.", async () => {
  await mongo_connection.connect();

  expect(mongo_connection.connected());

  await mongo_connection.disconnect();
});
