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


  const test = async () => {
    try {
      
      const datasets = await composeClient.executeQuery(`
      query {
        node(id: "did:pkh:eip155:1:0x514e3b94f0287caf77009039b72c321ef5f016e6") {
            ... on CeramicAccount {
            id
            datasetList(first: 100) {
                edges {
                node {
                    id
                    name
                  textClassificationRecords(first: 100){
                    edges{
                      node{
                        id
                     	  annotation_id
                        annotator
                        created_at
                        filename
                        _id
                        lead_time
                        review
                        sentiment
                        stars
                        type
                        uid
                        updated_at
                        url
                      }
                    }
                  }
                }
              }
            }
          } 
        }
      }
      `);
      console.log(datasets)
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
              test();
            }}
            style={{ margin: "auto", alignContent: "center" }}
          >
            test
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
