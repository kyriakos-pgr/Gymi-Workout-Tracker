import { Account, Client, Databases, ID, Storage } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

export const config = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  projectId: "6a0dae5a002dbed5e46b",
  databaseId: "6a0dafc90028e27cfba9",
  profilesTableId: "profiles",
  programsTableId: "programs",
  exercisesTableId: "exercises",
  workoutLogsTableId: "workoutLogs",
  setsTableId: "sets",
  profileImagesBucketId: "6a1a74a5002d5c3e8d7a",
};

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform("dev.kyriakos.gymi");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID };

