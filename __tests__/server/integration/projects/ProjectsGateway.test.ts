import { TEST_PROJECT_INSERT } from "@/__tests__/seeding/ProjectTestData";
import { buildMongoConnection } from "@/__tests__/seeding/setup";
import { ProjectsGateway } from "@/projects/ProjectsGateway";
import { PortfolioDatabase } from "@/services/db/PortfolioDatabase";
import { test } from "@jest/globals";

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
  await db.projects.deleteMany({});
  await mongo_connection.disconnect();
});

test("we can insert data into the projects collection.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);

  await project_data_gateway.insert({ ...TEST_PROJECT_INSERT });

  const project_on_disk = await db.projects.findOne({
    slug: "testing",
  });

  expect(project_on_disk).not.toBe(null);
});

test("we can find a project by the slug.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({ ...TEST_PROJECT_INSERT });

  const project = await project_data_gateway.findBySlug("testing");

  expect(project).not.toBe(null);
});

test("we can not find private projects on public search.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({
    ...TEST_PROJECT_INSERT,
    private: true
  });

  const project = await project_data_gateway.findPublicBySlug("testing");

  expect(project).toBe(null);
});

test("we can get a list of projects.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    { ...TEST_PROJECT_INSERT },
    {
      ...TEST_PROJECT_INSERT,
      slug: "testing_two"
    }
  ]);

  const projects = await project_data_gateway.findAll([]);

  expect(projects.length).toBe(2);
});

test("we only fetch the projects with specific tags.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_INSERT,
      tags: ["testing"],
    },
    {
      ...TEST_PROJECT_INSERT,
      tags: ["c++"],
      slug: "testing_two"
    },
    {
      ...TEST_PROJECT_INSERT,
      tags: ["c++", "testing_two"],
      slug: "testing_three"
    },
  ]);

  const projects = await project_data_gateway.findAll([
    "testing",
    "testing_two",
  ]);

  expect(projects.length).toBe(2);
});

test("we can get a list of public projects.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_INSERT,
      private: true
    },
    {
      ...TEST_PROJECT_INSERT,
      slug: "testing_two",
      private: false
    },
  ]);

  const projects = await project_data_gateway.findAllPublic([]);

  expect(projects.length).toBe(1);
});

test("we only fetch the public projects with specific tags.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_INSERT,
      tags: ["testing"],
      private: true
    },
    {
      ...TEST_PROJECT_INSERT,
      slug: "testing_two",
      tags: ["c++"],
      private: false
    },
    {
      ...TEST_PROJECT_INSERT,
      slug: "testing_three",
      tags: ["c++", "testing_two"],
      private: false
    },
  ]);

  const projects = await project_data_gateway.findAllPublic([
    "testing",
    "testing_two",
  ]);

  expect(projects.length).toBe(1);
});

test("we can update a project.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({ ...TEST_PROJECT_INSERT });

  await project_data_gateway.update("testing", {
    slug: "testing_updated",
  });

  const project_on_disk = await db.projects.findOne({
    slug: "testing_updated",
  });
  expect(project_on_disk).not.toBe(null);
});

test("we can not fetch a deleted project while searching by slug.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({
    ...TEST_PROJECT_INSERT,
    deleted_at: new Date()
  });

  const project = await project_data_gateway.findBySlug("testing");

  expect(project).toBe(null);
});

test("we can not fetch a deleted project while searching for all projects.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_INSERT,
      deleted_at: new Date(),
    },
    { ...TEST_PROJECT_INSERT },
  ]);

  const projects = await project_data_gateway.findAll([]);

  expect(projects.length).toBe(1);
});

test("we can remove a project.", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({ ...TEST_PROJECT_INSERT });

  await project_data_gateway.delete("testing");

  const project_on_disk = await db.projects.findOne({
    slug: "testing",
  });
  expect(project_on_disk?.deleted_at).not.toBe(undefined);
});
