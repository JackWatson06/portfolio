import { CollectionGateway } from "@/projects/CollectionGateway";
import { Validator } from "@/projects/Validator";
import {
  InvalidValidatorResult,
  SuccessfulValidatorResult,
  ValidatorResult,
} from "@/projects/ValidatorResult";
import { ProjectsTransactionScript } from "@/projects/ProjectTransactionScript";
import { Project } from "@/services/db/schemas/Project";
import { MockBlobStorage } from "@/services/fs/__mocks__/BlobStorage";
import { MatchKeysAndValues, WithId } from "mongodb";
import {
  TEST_PROJECT_ONE_CREATE_INPUT,
  TEST_PROJECT_TWO,
} from "@/__tests__/seeding/projects/ProjectData";
import { ServiceResult, SlugResult } from "@/projects/ProjectServiceResult";
import {
  TEST_PROJECT_ONE_PERSISTED,
  TEST_PROJECT_TWO_PERSISTED,
} from "@/__tests__/seeding/projects/ProjectInDBData";
import { BlobStorageResult } from "@/services/fs/BlobStorage";

class MockCollectionGateway implements CollectionGateway {
  public last_created_project: Project | null = null;
  public last_updated_project: MatchKeysAndValues<Project> | null = null;

  async findBySlug(slug: string): Promise<WithId<Project> | null> {
    if (slug == TEST_PROJECT_ONE_PERSISTED.slug) {
      return TEST_PROJECT_ONE_PERSISTED;
    }

    if (slug == TEST_PROJECT_TWO.slug) {
      return TEST_PROJECT_TWO_PERSISTED;
    }

    return null;
  }
  async findPublicBySlug(slug: string): Promise<WithId<Project> | null> {
    return TEST_PROJECT_ONE_PERSISTED;
  }
  async findAll(): Promise<Array<WithId<Project>>> {
    return [TEST_PROJECT_ONE_PERSISTED, TEST_PROJECT_TWO_PERSISTED];
  }
  async findAllPublic(): Promise<Array<WithId<Project>>> {
    return [TEST_PROJECT_ONE_PERSISTED];
  }
  async insert(project: Project): Promise<void> {
    this.last_created_project = project;
  }
  async update(
    slug: string,
    project: MatchKeysAndValues<Project>,
  ): Promise<void> {
    this.last_updated_project = project;
  }
  async delete(slug: string): Promise<void> {}
}

class StubValidator implements Validator {
  validate(project: Project): ValidatorResult {
    return new SuccessfulValidatorResult();
  }
}

class StubInvalidValidator implements Validator {
  validate(project: Project): ValidatorResult {
    return new InvalidValidatorResult("Invalid project input.");
  }
}

test("creating a project", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.create({
    ...TEST_PROJECT_ONE_CREATE_INPUT,
    name: "testing",
  });

  expect(script_result.code).toBe(ServiceResult.SUCCESS);
});

test("converting name for slug when creating a project", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.create({
    ...TEST_PROJECT_ONE_CREATE_INPUT,
    name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=",
  });

  expect((script_result as SlugResult).slug).toBe(
    "abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz0123456789",
  );
});

test("setting `created_at` when creating a project", async () => {
  const before_creating = new Date();
  const projects_collection_gateway = new MockCollectionGateway();
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    projects_collection_gateway,
    new MockBlobStorage(),
  );

  await projects_transaction_script.create({
    ...TEST_PROJECT_ONE_CREATE_INPUT,
    name: "testing",
  });

  expect(
    projects_collection_gateway.last_created_project?.created_at.valueOf(),
  ).toBeGreaterThanOrEqual(before_creating.valueOf());
});

test("setting `updated_at` when creating a project", async () => {
  const before_creating = new Date();
  const projects_collection_gateway = new MockCollectionGateway();
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    projects_collection_gateway,
    new MockBlobStorage(),
  );

  await projects_transaction_script.create({
    ...TEST_PROJECT_ONE_CREATE_INPUT,
    name: "testing",
  });

  expect(
    projects_collection_gateway.last_created_project?.updated_at.valueOf(),
  ).toBeGreaterThanOrEqual(before_creating.valueOf());
});

test("creating a project with a duplicate slug", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.create(
    TEST_PROJECT_ONE_CREATE_INPUT,
  );

  expect(script_result.code).toBe(ServiceResult.DUPLICATE);
});

test("creating project returns error when invalid", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubInvalidValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.create({
    ...TEST_PROJECT_ONE_CREATE_INPUT,
    name: "testing",
  });

  expect(script_result.code).toBe(ServiceResult.INVALID);
});

test("fetching a project", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const project = await projects_transaction_script.find("gandalf");

  expect(project).not.toBe(null);
});

test("fetching project by the name with proper slug", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const project = await projects_transaction_script.findByName(
    "._~:/?#[]@!$&'()*+,;=Gandalf._~:/?#[]@!$&'()*+,;=",
  );

  expect(project).not.toBe(null);
});

test("fetching public project", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const project = await projects_transaction_script.findPublic("gandalf");

  expect(project).not.toBe(null);
});

test("fetching all projects", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const projects = await projects_transaction_script.findAll([]);

  expect(projects.length).not.toBe(0);
});

test("fetching all public projects", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const projects = await projects_transaction_script.findAllPublic([]);

  expect(projects.length).not.toBe(0);
});

test("updating a project", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.update("gandalf", {
    private: false,
  });

  expect(script_result.code).toBe(ServiceResult.SUCCESS);
});

test("updating a project properly converts the slug", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.update("gandalf", {
    name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=",
  });

  expect((script_result as SlugResult).slug).toBe(
    "abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz0123456789",
  );
});

test("updating a project when the new slug is not unique", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.update("gandalf", {
    name: "Bilbo Baggins",
  });

  expect(script_result.code).toBe(ServiceResult.DUPLICATE);
});

test("updating project removes previous hashes", async () => {
  const mock_blob_storage = new MockBlobStorage();
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    mock_blob_storage,
  );

  await projects_transaction_script.update("gandalf", {
    removed_media_hashes: ["testing"],
  });

  expect(mock_blob_storage.last_remove_blob).toBe("testing");
});

test("updating project unsets removed media hashes", async () => {
  const mock_collections_gateway = new MockCollectionGateway();
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    mock_collections_gateway,
    new MockBlobStorage(),
  );

  await projects_transaction_script.update("gandalf", {
    removed_media_hashes: ["testing"],
  });

  expect(mock_collections_gateway.last_updated_project).not.toHaveProperty(
    "removed_media_hashes",
  );
});

test("updating project reports error in blob storage remove action", async () => {
  const mock_blob_storage = new MockBlobStorage();
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    mock_blob_storage,
  );
  mock_blob_storage.remove_blob_return = BlobStorageResult.ERROR;

  const script_result = await projects_transaction_script.update("gandalf", {
    removed_media_hashes: ["testing"],
  });

  expect(script_result.code).toBe(ServiceResult.COULD_NOT_REMOVE);
});

test("setting `updated_at` when updating a project", async () => {
  const projects_collection_gateway = new MockCollectionGateway();
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    projects_collection_gateway,
    new MockBlobStorage(),
  );

  await projects_transaction_script.update("gandalf", {
    private: false,
  });

  expect(projects_collection_gateway.last_updated_project).toHaveProperty(
    "updated_at",
  );
});

test("updating project returns error when it is invalid", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubInvalidValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result = await projects_transaction_script.update("gandalf", {
    private: false,
  });

  expect(script_result.code).toBe(ServiceResult.INVALID);
});

test("deleting a project that does not exist", async () => {
  const projects_transaction_script = new ProjectsTransactionScript(
    new StubValidator(),
    new MockCollectionGateway(),
    new MockBlobStorage(),
  );

  const script_result =
    await projects_transaction_script.delete("does_not_exist");

  expect(script_result.code).toBe(ServiceResult.NOT_FOUND);
});

test.todo("tags can not have any duplicates.");
test.todo("deleting files when editing the media files");
