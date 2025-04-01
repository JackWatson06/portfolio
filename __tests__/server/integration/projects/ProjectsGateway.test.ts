import {
  TEST_PROJECT_ONE,
  TEST_PROJECT_THREE,
  TEST_PROJECT_TWO,
} from "@/__tests__/seeding/projects/ProjectData";
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

test("inserting data into the projects collection", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);

  await project_data_gateway.insert({ ...TEST_PROJECT_ONE });

  const project_on_disk = await db.projects.findOne({
    slug: "gandalf",
  });

  expect(project_on_disk).not.toBe(null);
});

test("finding a project by slug", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({ ...TEST_PROJECT_ONE });

  const project = await project_data_gateway.findBySlug("gandalf");

  expect(project).not.toBe(null);
});

test("private projects do not return on public search", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({
    ...TEST_PROJECT_ONE,
    private: true,
  });

  const project = await project_data_gateway.findPublicBySlug("gandalf");

  expect(project).toBe(null);
});

test("listing all projects", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    { ...TEST_PROJECT_ONE },
    { ...TEST_PROJECT_TWO },
  ]);

  const projects = await project_data_gateway.findAll([]);

  expect(projects.length).toBe(2);
});

test("fetching projects with specific tags", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_ONE,
      tags: ["testing"],
    },
    {
      ...TEST_PROJECT_TWO,
      tags: ["c++"],
    },
    {
      ...TEST_PROJECT_THREE,
      tags: ["c++", "testing_two"],
    },
  ]);

  const projects = await project_data_gateway.findAll([
    "testing",
    "testing_two",
  ]);

  expect(projects.length).toBe(2);
});

test("fetching all public projects", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_ONE,
      private: true,
    },
    {
      ...TEST_PROJECT_TWO,
      private: false,
    },
  ]);

  const projects = await project_data_gateway.findAllPublic([]);

  expect(projects.length).toBe(1);
});

test("fetching public projects with specific tags", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_ONE,
      tags: ["testing"],
      private: true,
    },
    {
      ...TEST_PROJECT_TWO,
      tags: ["c++"],
      private: false,
    },
    {
      ...TEST_PROJECT_THREE,
      tags: ["c++", "testing_two"],
      private: false,
    },
  ]);

  const projects = await project_data_gateway.findAllPublic([
    "testing",
    "testing_two",
  ]);

  expect(projects.length).toBe(1);
});

test("updating project", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({ ...TEST_PROJECT_ONE });

  await project_data_gateway.update("gandalf", {
    slug: "testing_updated",
  });

  const project_on_disk = await db.projects.findOne({
    slug: "testing_updated",
  });
  expect(project_on_disk).not.toBe(null);
});

test("deleted project does not return on fetch by slug", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({
    ...TEST_PROJECT_ONE,
    deleted_at: new Date(),
  });

  const project = await project_data_gateway.findBySlug("gandalf");

  expect(project).toBe(null);
});

test("deleted project does not return on find all", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertMany([
    {
      ...TEST_PROJECT_ONE,
      deleted_at: new Date(),
    },
    { ...TEST_PROJECT_TWO },
  ]);

  const projects = await project_data_gateway.findAll([]);

  expect(projects.length).toBe(1);
});

test("removing project", async () => {
  const project_data_gateway = new ProjectsGateway(db.projects);
  await db.projects.insertOne({ ...TEST_PROJECT_ONE });

  await project_data_gateway.delete("gandalf");

  const project_on_disk = await db.projects.findOne({
    slug: "gandalf",
  });
  expect(project_on_disk?.deleted_at).not.toBe(undefined);
});
