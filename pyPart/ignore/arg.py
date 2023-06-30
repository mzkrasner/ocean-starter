from datasets import load_dataset, Dataset
from flask import Flask, redirect, url_for, request, json, jsonify
from flask_cors import CORS
import os
import argilla as rg

app = Flask(__name__)
CORS(app)
@app.route('/summary',methods = ['POST', 'GET'])
def summary():
    rg.init(
        api_url="http://localhost:6900", 
        api_key="admin.apikey"
    )
    
    # dataset = load_dataset("argilla/reward-model-data-falcon")
    feedback_dataset = rg.FeedbackDataset.from_huggingface("argilla/reward-model-data-falcon")
    #feedback_dataset.push_to_argilla(name="falcon-clone", workspace="admin")
    #dataset = rg.FeedbackDataset.from_argilla("my-dataset", workspace="my-workspace")



    # data = {"instruction": [], "context": [], "response": []}
    # for entry in feedback_dataset:
    #     if entry.responses:
    #         res = entry.responses[0].values
    #         data["instruction"].append(res["new-instruction"].value)
    #         data["context"].append(res["new-context"].value)
    #         data["response"].append(res["new-response"].value)

    # dataset = Dataset.from_dict(data)
    # print(dataset[0])
    # dataset

    #feedback_dataset = rg.FeedbackDataset.from_argilla("my-dataset", workspace="my-workspace")

    # fields = [
    #     rg.TextField(name="instruction", title="User instruction"),
    #     rg.TextField(name="response-1"),
    #     rg.TextField(name="response-2"),
    #     rg.ResponseSchema(name="choose-best")
    # ]
    rows = []
    for record in feedback_dataset.records:

        if record.responses is None or len(record.responses) == 0:
            continue
        # get chosen index from RatingQuestion response
        chosen_id = record.responses[0].values["choose-best"].value
        rejected_id = 2 if chosen_id == 1 else 1
        # build rows for rm training
        rows.append({
            "instruction": record.fields["instruction"],
            "chosen_response": record.fields[f"response-{chosen_id}"],
            "rejected_response": record.fields[f"response-{rejected_id}"]
        })
    print(rows[0])
    return jsonify(feedback_dataset.guidelines, rows)
if __name__ == "__main__": 
    app.run(port=5000)
    # build dataset for training
    # prepared_dataset = Dataset.from_list(rows)
    # prepared_dataset.to_pandas()