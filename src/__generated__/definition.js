// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    User: {
      id: "kjzl6hvfrbw6c96g4wonqjl65qs2nt10ep6i1e7j8euudf6y5b58859v3yyixaj",
      accountRelation: { type: "single" },
    },
    Dataset: {
      id: "kjzl6hvfrbw6c9bro4iy4xy895r2feyfig8le750tlyqiclxk6ut751p75urkhs",
      accountRelation: { type: "list" },
    },
    TextClassificationRecord: {
      id: "kjzl6hvfrbw6c6u7x9jq147e82npyv1x56znggr7n8lzb27s4lyaqkgxr5rsdeu",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    User: {
      last_name: { type: "string", required: true },
      first_name: { type: "string", required: true },
      author: { type: "view", viewType: "documentAccount" },
      datasets: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c9bro4iy4xy895r2feyfig8le750tlyqiclxk6ut751p75urkhs",
          property: "userId",
        },
      },
    },
    Dataset: {
      name: { type: "string", required: true },
      type: { type: "string", required: false },
      userId: { type: "streamid", required: true },
      user: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c96g4wonqjl65qs2nt10ep6i1e7j8euudf6y5b58859v3yyixaj",
          property: "userId",
        },
      },
      author: { type: "view", viewType: "documentAccount" },
      textClassificationRecords: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c6u7x9jq147e82npyv1x56znggr7n8lzb27s4lyaqkgxr5rsdeu",
          property: "datasetId",
        },
      },
    },
    TextClassificationRecord: {
      _id: { type: "integer", required: true },
      uid: { type: "integer", required: true },
      url: { type: "string", required: true },
      type: { type: "string", required: true },
      stars: { type: "integer", required: true },
      review: { type: "string", required: true },
      filename: { type: "string", required: true },
      annotator: { type: "integer", required: true },
      datasetId: { type: "streamid", required: true },
      lead_time: { type: "float", required: true },
      sentiment: { type: "string", required: true },
      created_at: { type: "string", required: true },
      updated_at: { type: "string", required: true },
      annotation_id: { type: "integer", required: true },
      author: { type: "view", viewType: "documentAccount" },
      dataset: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c9bro4iy4xy895r2feyfig8le750tlyqiclxk6ut751p75urkhs",
          property: "datasetId",
        },
      },
    },
  },
  enums: {},
  accountData: {
    user: { type: "node", name: "User" },
    datasetList: { type: "connection", name: "Dataset" },
    textClassificationRecordList: {
      type: "connection",
      name: "TextClassificationRecord",
    },
  },
};
