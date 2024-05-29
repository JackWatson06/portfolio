import portfolio_service_locator from "@/services/setup";

const mongo_connection = portfolio_service_locator.mongo_connection

test("We can connect to the MongoDB client.", async () => {
  await mongo_connection.connect();

  expect(mongo_connection.connected());

  await mongo_connection.disconnect();
});
