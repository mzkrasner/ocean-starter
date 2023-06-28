import { readFileSync } from "fs";
import { CeramicClient } from "@ceramicnetwork/http-client";
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
} from "@composedb/devtools-node";
import { Composite } from "@composedb/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const ceramic = new CeramicClient("http://localhost:7007");

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate();
  spinner.info("writing composite to Ceramic");

  // const userComposite = await createComposite(
  //   ceramic,
  //   "./composites-new/00-User.graphql"
  // );

  // const workspaceComposite = await createComposite(
  //   ceramic,
  //   "./composites-new/01-Workspace.graphql"
  // );

  // const dataSetSchema = readFileSync("./composites-new/02-Dataset.graphql", {
  //   encoding: "utf-8",
  // }).replace("$WORKSPACE_ID", workspaceComposite.modelIDs[0]);

  // const dataSetComposite = await Composite.create({
  //   ceramic,
  //   schema: dataSetSchema,
  // });

  // const dataSetWorkspaceSchema = readFileSync(
  //   "./composites-new/03-DatasetWorkspace.graphql",
  //   {
  //     encoding: "utf-8",
  //   }
  // )
  //   .replace("$DATASET_ID", dataSetComposite.modelIDs[1])
  //   .replace("$WORKSPACE_ID", workspaceComposite.modelIDs[0]);

  // const dataSetWorkspaceComposite = await Composite.create({
  //   ceramic,
  //   schema: dataSetWorkspaceSchema,
  // });

  // const fieldSchema = readFileSync("./composites-new/04-Field.graphql", {
  //   encoding: "utf-8",
  // }).replace("$DATASET_ID", dataSetComposite.modelIDs[1]);

  // const fieldComposite = await Composite.create({
  //   ceramic,
  //   schema: fieldSchema,
  // });

  // const questionSchema = readFileSync("./composites-new/05-Question.graphql", {
  //   encoding: "utf-8",
  // }).replace("$DATASET_ID", dataSetComposite.modelIDs[1]);

  // const questionComposite = await Composite.create({
  //   ceramic,
  //   schema: questionSchema,
  // });

  // const recordSchema = readFileSync("./composites-new/06-Record.graphql", {
  //   encoding: "utf-8",
  // }).replace("$DATASET_ID", dataSetComposite.modelIDs[1]);

  // const recordComposite = await Composite.create({
  //   ceramic,
  //   schema: recordSchema,
  // });

  // const responseSchema = readFileSync("./composites-new/07-Response.graphql", {
  //   encoding: "utf-8",
  // }).replace("$RECORD_ID", recordComposite.modelIDs[1]);

  // const responseComposite = await Composite.create({
  //   ceramic,
  //   schema: responseSchema,
  // });

  // const recordResponsesSchema = readFileSync(
  //   "./composites-new/08-RecordResponses.graphql",
  //   {
  //     encoding: "utf-8",
  //   }
  // )
  //   .replace("$RESPONSE_ID", responseComposite.modelIDs[1])
  //   .replace("$RECORD_ID", recordComposite.modelIDs[1]);

  // const recordResponsesComposite = await Composite.create({
  //   ceramic,
  //   schema: recordResponsesSchema,
  // });

  // const datasetConnectionsSchema = readFileSync(
  //   "./composites-new/09-DatasetConnections.graphql",
  //   {
  //     encoding: "utf-8",
  //   }
  // )
  //   .replace("$FIELD_ID", fieldComposite.modelIDs[1])
  //   .replace("$QUESTION_ID", questionComposite.modelIDs[1])
  //   .replace("$RECORD_ID", recordComposite.modelIDs[1])
  //   .replace("$DATASET_ID", dataSetComposite.modelIDs[1]);

  // const dataSetConnectionsComposite = await Composite.create({
  //   ceramic,
  //   schema: datasetConnectionsSchema,
  // });

  // const composite = Composite.from([
  //   userComposite,
  //   workspaceComposite,
  //   dataSetComposite,
  //   dataSetWorkspaceComposite,
  //   fieldComposite,
  //   questionComposite,
  //   recordComposite,
  //   responseComposite,
  //   recordResponsesComposite,
  //   dataSetConnectionsComposite]);

  const rewardDatasetComposite = await createComposite(
    ceramic,
    "./composites/RewardDataset.graphql"
  );

  const rewardRecordSchema = readFileSync("./composites/RewardRecord.graphql", {
    encoding: "utf-8",
  }).replace("$DATASET_ID", rewardDatasetComposite.modelIDs[0])

  const rewardRecordComposite = await Composite.create({
    ceramic,
    schema: rewardRecordSchema,
  });

  const text2textSchema = readFileSync("./composites/Text2TextRecord.graphql", {
    encoding: "utf-8",
  }).replace("$DATASET_ID", rewardDatasetComposite.modelIDs[0])

  const text2textComposite = await Composite.create({
    ceramic,
    schema: text2textSchema,
  });

  const rewardRecordDataConnectSchema = readFileSync("./composites/RewardRecordDataConnect.graphql", {
    encoding: "utf-8",
  }).replace("$RECORD_ID", rewardRecordComposite.modelIDs[1])
    .replace("$DATASET_ID", rewardDatasetComposite.modelIDs[0])

  const rewardRecordDataConnectComposite = await Composite.create({
    ceramic,
    schema: rewardRecordDataConnectSchema,
  });

  const composite = Composite.from([
    rewardDatasetComposite,
    rewardRecordComposite,
    text2textComposite,
    rewardRecordDataConnectComposite
  ]);

  await writeEncodedComposite(composite, "./src/__generated__/definition.json");
  spinner.info("creating composite for runtime usage");
  await writeEncodedCompositeRuntime(
    ceramic,
    "./src/__generated__/definition.json",
    "./src/__generated__/definition.js"
  );
  spinner.info("deploying composite");
  const deployComposite = await readEncodedComposite(
    ceramic,
    "./src/__generated__/definition.json"
  );

  await deployComposite.startIndexingOn(ceramic);
  spinner.succeed("composite deployed & ready for use");
};

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = readFileSync("./admin_seed.txt");
  const key = fromString(seed, "base16");
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  });
  await did.authenticate();
  ceramic.did = did;
};
