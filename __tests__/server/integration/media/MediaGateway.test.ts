import { buildMongoConnection } from "@/__tests__/seeding/setup";
import { MediaGateway } from "@/media/MediaGateway";
import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";
import { Media } from "@/services/db/schemas/Media";
import { test } from "@jest/globals";

const TEST_MEDIA_ONE: Media = {
  hash: "testing",
  file_name: "testing.png",
  content_type: "image/png",
  size: 1000,
  uploaded_at: new Date("2024-02-01T01:00Z"),
};

const TEST_MEDIA_TWO: Media = {
  hash: "testing_two",
  file_name: "testing.png",
  content_type: "image/png",
  size: 1000,
  uploaded_at: new Date("2024-02-021T01:00Z"),
};

const mongo_connection = buildMongoConnection();
let db: PortfolioDatabase;

beforeEach(async () => {
  await mongo_connection.connect();

  if (!mongo_connection.connected()) {
    throw new Error("Could not connect to the database.");
  }

  db = mongo_connection.db;
});

afterEach(async () => {
  await db.media.deleteMany({});
  await mongo_connection.disconnect();
});

test("inserting data into media collection.", async () => {
  const media_data_gateway = new MediaGateway(db.media);

  await media_data_gateway.insert({ ...TEST_MEDIA_ONE });

  expect(
    db.media.findOne({
      hash: "testing",
    }),
  ).not.toBe(null);
});

test("querying most recent media element by hash", async () => {
  const media_data_gateway = new MediaGateway(db.media);
  await db.media.insertMany([{ ...TEST_MEDIA_ONE }, { ...TEST_MEDIA_TWO }]);

  const media = await media_data_gateway.find("testing.png");

  expect(media?.hash).toBe("testing_two");
});

test("removing a meida element by hash", async () => {
  const media_data_gateway = new MediaGateway(db.media);
  await db.media.insertMany([{ ...TEST_MEDIA_ONE }, { ...TEST_MEDIA_TWO }]);

  await media_data_gateway.delete("testing.png");

  expect(
    (
      await db.media
        .find({
          file_name: "testing.png",
        })
        .toArray()
    ).length,
  ).toBe(0);
});
