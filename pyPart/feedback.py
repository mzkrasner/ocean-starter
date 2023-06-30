from datasets import load_dataset, Dataset, load_dataset_builder
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
    # feedbackTask
    feedback = rg.FeedbackDataset.from_huggingface("argilla/reward-model-data-falcon")

    rows = []
    for record in feedback.records:

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
    data = {"fields": [], "questions": [], "guidelines": [], "rows": rows}
    for i, entry in enumerate(feedback):
        if entry.fields:
            data["fields"].append({"fields": entry.fields, "index": i})
        if "questions" in entry:
            data["questions"].append({"questions": entry.questions, "index": i})
        if "guidelines" in entry:
            data["guidelines"].append({"guidelines": entry.guidelines, "index": i})
    return jsonify({"guidelines": feedback.guidelines, "data": data, "rows": rows})
if __name__ == "__main__": 
    app.run(port=5000)
