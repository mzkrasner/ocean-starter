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


  const dataSetComposite = await createComposite(
    ceramic,
    "./composites/Dataset.graphql"
  );

  const feedbackRecordSchema = readFileSync("./composites/FeedbackRecord.graphql", {
    encoding: "utf-8",
  }).replace("$DATASET_ID", dataSetComposite.modelIDs[0])

  const feedbackRecordComposite = await Composite.create({
    ceramic,
    schema: feedbackRecordSchema,
  });

  const text2textSchema = readFileSync("./composites/Text2TextRecord.graphql", {
    encoding: "utf-8",
  }).replace("$DATASET_ID", dataSetComposite.modelIDs[0])

  const text2textComposite = await Composite.create({
    ceramic,
    schema: text2textSchema,
  });

  const textClassificationSchema = readFileSync("./composites/TextClassificationRecord.graphql", {
    encoding: "utf-8",
  }).replace("$DATASET_ID", dataSetComposite.modelIDs[0])

  const textClassificationComposite = await Composite.create({
    ceramic,
    schema: textClassificationSchema,
  });

  const tokenClassificationSchema = readFileSync("./composites/TokenClassificationRecord.graphql", {
    encoding: "utf-8",
  }).replace("$DATASET_ID", dataSetComposite.modelIDs[0])

  const tokenClassificationComposite = await Composite.create({
    ceramic,
    schema: tokenClassificationSchema,
  });

  const datasetConnectSchema = readFileSync("./composites/DatasetConnect.graphql", {
    encoding: "utf-8",
  }).replace("$FEEDBACK_ID", feedbackRecordComposite.modelIDs[1])
    .replace("$TEXTTOTEXT_ID", text2textComposite.modelIDs[1])
    .replace("$TEXTCLASSIFICATION_ID", textClassificationComposite.modelIDs[1])
    .replace("$TOKEN_ID", tokenClassificationComposite.modelIDs[1])
    .replace("$DATASET_ID", dataSetComposite.modelIDs[0])

  const dataSetConnectComposite = await Composite.create({
    ceramic,
    schema: datasetConnectSchema,
  });

  const composite = Composite.from([
    dataSetComposite,
    feedbackRecordComposite,
    text2textComposite,
    textClassificationComposite,
    tokenClassificationComposite,
    dataSetConnectComposite
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
