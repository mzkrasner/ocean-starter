import { readFileSync } from 'fs';
import { CeramicClient } from '@ceramicnetwork/http-client'
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
} from "@composedb/devtools-node";
import { Composite } from "@composedb/devtools";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const ceramic = new CeramicClient("http://localhost:7007");

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate()

  //Note: the lines below are commented out because we are accessing existing/already deployed streams

  // const userComposite = await createComposite(
  //   ceramic,
  //   "./composites-newer/00-User.graphql"
  // );

  // const datasetSchema = readFileSync("./composites-newer/01-Dataset.graphql", {
  //   encoding: "utf-8",
  // }).replace("$USER_ID", userComposite.modelIDs[0])

  // const dataSetComposite = await Composite.create({
  //   ceramic,
  //   schema: datasetSchema,
  // });

  // const textClassificationSchema = readFileSync("./composites-newer/02-TextClassificationRecord.graphql", {
  //   encoding: "utf-8",
  // }).replace("$DATASET_ID", dataSetComposite.modelIDs[1])

  // const textClassificationComposite = await Composite.create({
  //   ceramic,
  //   schema: textClassificationSchema,
  // });

  // const datasetConnectSchema = readFileSync("./composites-newer/03-DatasetConnect.graphql", {
  //   encoding: "utf-8",
  // }).replace("$TEXTCLASSIFICATION_ID", textClassificationComposite.modelIDs[1])
  //   .replace("$DATASET_ID", dataSetComposite.modelIDs[1])

  // const dataSetConnectComposite = await Composite.create({
  //   ceramic,
  //   schema: datasetConnectSchema,
  // });

  // const userConnectSchema = readFileSync("./composites-newer/04-UserConnect.graphql", {
  //   encoding: "utf-8",
  // }).replace("$DATASET_ID", dataSetComposite.modelIDs[1])
  //   .replace("$USER_ID", userComposite.modelIDs[0])

  // const userConnectComposite = await Composite.create({
  //   ceramic,
  //   schema: userConnectSchema,
  // });

  // const composite = Composite.from([
  //   userComposite,
  //   dataSetComposite,
  //   textClassificationComposite,
  //   dataSetConnectComposite,
  //   userConnectComposite
  // ]);
  // spinner.info("writing composite to Ceramic")
  // const composite = await createComposite(ceramic, './composites/basicProfile.graphql')
  // await writeEncodedComposite(composite, "./src/__generated__/definition.json");
  // spinner.info('creating composite for runtime usage')
  // await writeEncodedCompositeRuntime(
  //   ceramic,
  //   "./src/__generated__/definition.json",
  //   "./src/__generated__/definition.js"
  // );
  spinner.info('deploying composite')
  const deployComposite = await readEncodedComposite(ceramic, './definition.json')

  await deployComposite.startIndexingOn(ceramic)
  spinner.succeed("composite deployed & ready for use");
}

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = readFileSync('./admin_seed.txt')
  const key = fromString(
    seed,
    "base16"
  );
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key)
  })
  await did.authenticate()
  ceramic.did = did
}