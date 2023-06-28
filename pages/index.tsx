import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { BasicProfile } from "@datamodels/identity-profile-basic";
import ceramicLogo from "../public/ceramic.png";
import { useCeramicContext } from "../context";
import { authenticateCeramic } from "../utils";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [profile, setProfile] = useState<BasicProfile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);

  //runs on useeffect
  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient);
    if (localStorage.getItem("did")) {
      setAuth(true);
    }
  };

  //sign in with Ethereum
  const authenticate = async () => {
    await authenticateCeramic(ceramic, composeClient);
    if (localStorage.getItem("did")) {
      setAuth(true);
    }
  };

  //use this method to encrypt a string
  const encrypt = async (input: string) => {
    const result = await fetch("/api/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const item = await result.json();
    return item.message;
  };

  //use this method to decrypt a string
  const decrypt = async (input: string) => {
    const result = await fetch("/api/decrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const item = await result.json();
    return item.message;
  };

  const checkPy = async () => {
    try {
      //temporary for testing: access python server to obtain datasets
      const response = await fetch("http://127.0.0.1:5000/summary", {
        method: "GET",
      });

      const result = await response.json();
      console.log(result)
      //create a meta dataset in Compose under which records will be saved
      const dataset = await composeClient.executeQuery(`
        mutation{
            createDataset(
            input: {
                content: {
                name: "Place dataset name here"
                status: ready
                }
            }
            ) {
            document {
                id
                name
                status
            }
          }
        }
    `);

      console.log(dataset);

      //We will use this streamID later when generating records
      let streamID = "";
      const createDataset: any = dataset.data?.createDataset;
      if (createDataset.document) {
        streamID = createDataset.document.id;
      }
      if (streamID.length) {
        for (let i = 0; i < 10; i++) {
          const encrypted = await encrypt(result.event_timestamp[i]);
          console.log(encrypted);
          const saveToCompose = await composeClient.executeQuery(`
            mutation{
                createTextClassificationRecord(
                input: {
                    content: {
                    text: "${await encrypt(JSON.stringify(result.text[i]))}"
                    inputs: "${await encrypt(JSON.stringify(result.inputs[i]))}"
                    prediction: "${await encrypt(
                      JSON.stringify(result.prediction[i])
                    )}"
                    prediction_agent: "${await encrypt(
                      JSON.stringify(result.prediction_agent[i])
                    )}"
                    annotation: "${
                      result.annotation[i]
                        ? await encrypt(JSON.stringify(result.annotation[i]))
                        : ""
                    }"
                    annotation_agent: "${
                      result.annotation_agent[i]
                        ? await encrypt(
                            JSON.stringify(result.annotation_agent[i])
                          )
                        : ""
                    }"
                    vectors: "${
                      result.vectors[i]
                        ? await encrypt(JSON.stringify(result.vectors[i]))
                        : ""
                    }"
                    multi_label: "${
                      result.multi_label[i]
                        ? await encrypt(JSON.stringify(result.multi_label[i]))
                        : ""
                    }"
                    explanation: "${
                      result.explanation[i]
                        ? await encrypt(JSON.stringify(result.explanation[i]))
                        : ""
                    }"
                    argillaId: "${
                      result.id[i]
                        ? await encrypt(JSON.stringify(result.id[i]))
                        : ""
                    }"
                    metadata: "${
                      result.metadata[i]
                        ? await encrypt(JSON.stringify(result.metadata[i]))
                        : ""
                    }"
                    status: "${
                      result.status[i]
                        ? await encrypt(JSON.stringify(result.status[i]))
                        : ""
                    }"
                    event_timestamp: "${
                      result.event_timestamp[i]
                        ? await encrypt(
                            JSON.stringify(result.event_timestamp[i])
                          )
                        : ""
                    }"
                    metrics: "${
                      result.metrics[i]
                        ? await encrypt(
                            JSON.stringify(JSON.stringify(result.metrics[i]))
                          )
                        : ""
                    }"
                    search_keywords: "${
                      result.search_keywords[i]
                        ? await encrypt(
                            JSON.stringify(result.search_keywords[i])
                          )
                        : ""
                    }"
                    datasetId: "${streamID}"
                    }
                  }
                ) {
                document {
                    id
                    author{
                        id
                    }
                    text
                    inputs
                    prediction
                    prediction_agent
                    annotation
                    annotation_agent
                    vectors
                    multi_label
                    explanation
                    argillaId
                    metadata
                    status
                    event_timestamp
                    metrics
                    search_keywords
                    dataset {
                        id
                    }
                }
              }
            }
        `);
          console.log(saveToCompose);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //method just to check python server
  const checkData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/summary", {
        method: "GET",
      });
      console.log(response);
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const grabAndDecrypt = async () => {
    try {

    const session = await authenticateCeramic(ceramic, composeClient);
    const pkh = session.cacao.p.iss;

    //do not use in production
    type dataSetsAccounts = {
        [key: string]: any; 
      };

    const getDatasetsByAccount: dataSetsAccounts = await composeClient.executeQuery(`
    query {
        node(id: "${pkh}") {
            ... on CeramicAccount {
            id
            datasetList(first: 10) {
                edges {
                node {
                    id
                    name
                }
              }
            }
          } 
        }
      }
    `);

    //query using streamID from previous query as Dataset filter
    //only pulling in last 10 as example --> actual dataset will contain many more rows
    const query = await composeClient.executeQuery(`
      query {
        node(id: "${getDatasetsByAccount.data.node.datasetList.edges[0].node.id}") {
          ...on Dataset {
            author {
              id
              textClassificationRecordList (last: 10) {
                edges {
                  node {
                    text
                    inputs
                    prediction
                    prediction_agent
                    annotation
                    annotation_agent
                    vectors
                    multi_label
                    explanation
                    argillaId
                    metadata
                    status
                    event_timestamp
                    metrics
                    search_keywords
                    datasetId
                  }
                }
              }
            }
          }
        }
      }
    `);

      const node: any = query?.data?.node;
      if (node.author) {
        const data = node.author?.textClassificationRecordList?.edges;
        console.log(data[0].node.event_timestamp, "234");
        const i = await decrypt(data[0].node.event_timestamp);
        for (const item of data) {
          const el = item.node;
          for (const i in el) {
            if (el[i].length && i !== "datasetId") {
              const decrypted = await decrypt(el[i]);
              el[i] = JSON.parse(decrypted);
            }
          }
        }
        console.log(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create ceramic app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ display: "relative", flexDirection: "column" }}>
          {auth ? (
            <button
              onClick={() => {
                alert("You are already authenticated");
              }}
              style={{ margin: "auto", alignContent: "center" }}
            >
              Authenticated
            </button>
          ) : (
            <button
              onClick={() => {
                authenticate();
              }}
              style={{ margin: "auto", alignContent: "center" }}
            >
              Authenticate
            </button>
          )}
          <button
            onClick={() => {
              checkPy();
            }}
            style={{ margin: "auto", alignContent: "center" }}
          >
            Save to Compose
          </button>
          <button
            onClick={() => {
              checkData();
            }}
            style={{ margin: "auto", alignContent: "center" }}
          >
            Check Data
          </button>
          <button
            onClick={() => {
              grabAndDecrypt();
            }}
            style={{ margin: "auto", alignContent: "center" }}
          >
            Decrypt
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
