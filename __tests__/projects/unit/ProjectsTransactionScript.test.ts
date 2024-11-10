import { CollectionGateway } from "@/projects/CollectionGateway";
import { Validator } from "@/projects/Validator";
import {
  InvalidValidatorResult,
  SuccessfulValidatorResult,
  ValidatorResult,
} from "@/projects/ValidatorResult";
import { ProjectsTransactionScript } from "@/projects/ProjectsTransactionScript";
import { Project } from "@/services/db/schemas/Project";
import { MatchKeysAndValues, WithId } from "mongodb";
import {
  TEST_PRIVATE_PROJECT,
  TEST_PUBLIC_PROJECT,
  createLinkInputs,
  createMediaInputs,
} from "./ProjectTestData";
import {
  ScriptResult,
  SlugScriptResult,
} from "@/projects/TransactionScriptResult";

class TestCollectionGateway implements CollectionGateway {
  async findBySlug(slug: string): Promise<WithId<Project> | null> {
    if (slug == TEST_PUBLIC_PROJECT.slug) {
      return TEST_PUBLIC_PROJECT;
    }

    if (slug == "testing2") {
      return TEST_PUBLIC_PROJECT;
    }

    return null;
  }

  async findPublicBySlug(slug: string): Promise<WithId<Project> | null> {
    return TEST_PUBLIC_PROJECT;
  }

  async findAll(): Promise<Array<WithId<Project>>> {
    return [TEST_PRIVATE_PROJECT, TEST_PUBLIC_PROJECT];
  }

  async findAllPublic(): Promise<Array<WithId<Project>>> {
    return [TEST_PRIVATE_PROJECT, TEST_PUBLIC_PROJECT];
  }

  async insert(project: Project): Promise<void> {}
  async update(
    slug: string,
    project: MatchKeysAndValues<Project>,
  ): Promise<void> {}
  async delete(slug: string): Promise<void> {}
}

class TestValidator implements Validator {
  validate(project: Project): ValidatorResult {
    return new SuccessfulValidatorResult();
  }
}

class TestInvalidValidator implements Validator {
  validate(project: Project): ValidatorResult {
    return new InvalidValidatorResult("Invalid project input.");
  }
}

test("we can create a project.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.create({
    name: "testing_create",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: createMediaInputs(),
    links: createLinkInputs(),
    private: false,
  });

  expect(script_result.code).toBe(ScriptResult.SUCCESS);
});

test(" we properly convert name for slug when creating.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.create({
    name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: createMediaInputs(),
    links: createLinkInputs(),
    private: false,
  });

  expect((script_result as SlugScriptResult).slug).toBe(
    "abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz0123456789",
  );
});

test("we can not create project with duplicate slug.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.create({
    name: "testing",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: createMediaInputs(),
    links: createLinkInputs(),
    private: false,
  });

  expect(script_result.code).toBe(ScriptResult.DUPLICATE);
});

test("we get error when the project is invalid.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestInvalidValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.create({
    name: "testing_invalid",
    description: "testing",
    tags: ["mongodb", "c++", "typescript"],
    thumbnail_media: "https://testing.com/picture_one",
    live_project_link: "https://testing.com",
    media: createMediaInputs(),
    links: createLinkInputs(),
    private: false,
  });

  expect(script_result.code).toBe(ScriptResult.INVALID);
});

test("we can fetch a project.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const project = await projects_transaction_script.find("testing");

  expect(project).not.toBe(null);
});

test("we can fetch a public project.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const project = await projects_transaction_script.findPublic("testing");

  expect(project).not.toBe(null);
});

test("we can fetch all projects.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const projects = await projects_transaction_script.findAll([]);

  expect(projects.length).not.toBe(0);
});

test("we can fetch all public projects.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const projects = await projects_transaction_script.findAllPublic([]);

  expect(projects.length).not.toBe(0);
});

test("we can update a project.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.update("testing", {
    private: false,
  });

  expect(script_result.code).toBe(ScriptResult.SUCCESS);
});

test("when we update a project we properly convert the slug.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.update("testing", {
    name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=",
  });

  expect((script_result as SlugScriptResult).slug).toBe(
    "abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz0123456789",
  );
});

test("we can not update a project when the new slug is not unique.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.update("testing", {
    name: "testing2",
  });

  expect(script_result.code).toBe(ScriptResult.DUPLICATE);
});

test("we get an error when the update project is invalid.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestInvalidValidator(),
    new TestCollectionGateway(),
  );

  const script_result = await projects_transaction_script.update("testing", {
    private: false,
  });

  expect(script_result.code).toBe(ScriptResult.INVALID);
});

test("we can not delete a project that does not exist.", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new TestValidator(),
    new TestCollectionGateway(),
  );

  const script_result =
    await projects_transaction_script.delete("does_not_exist");

  expect(script_result.code).toBe(ScriptResult.NOT_FOUND);
});
