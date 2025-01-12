import { Project } from "@/services/db/schemas/Project";
import { ObjectId, WithId } from "mongodb";
import { TEST_PROJECT_ONE, TEST_PROJECT_TWO } from "./ProjectData";

export const TEST_PROJECT_ONE_PERSISTED: WithId<Project> = {
  ...TEST_PROJECT_ONE,
  _id: new ObjectId(),
};

export const TEST_PROJECT_TWO_PERSISTED: WithId<Project> = {
  ...TEST_PROJECT_TWO,
  _id: new ObjectId(),
};
