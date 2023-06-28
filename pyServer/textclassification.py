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
    # textClassification
    sentiment = rg.load(name="sst-sentiment-explainability")

    data = {"text": [], "inputs": [], "prediction": [], "prediction_agent": [], "annotation": [], "annotation_agent": [], "vectors": [], 
            "multi_label": [], "explanation": [], "id": [], "metadata": [], "status": [], "event_timestamp": [], "metrics": [], "search_keywords": [] }
    for i, entry in enumerate(sentiment):
        if entry.text:
            data["text"].append(entry.text)
        if entry.inputs:
            data["inputs"].append(entry.inputs)
        if entry.prediction:
            data["prediction"].append(entry.prediction)
        if entry.prediction_agent:
            data["prediction_agent"].append(entry.prediction_agent)
        if entry.annotation:
            data["annotation"].append(entry.annotation)
        if entry.annotation_agent:
            data["annotation_agent"].append(entry.annotation_agent)
        if entry.vectors:
            data["vectors"].append(entry.vectors)
        if entry.multi_label:
            data["multi_label"].append(entry.multi_label)
        if entry.explanation:
            data["explanation"].append(*entry.explanation)
        if entry.id:
            data["id"].append(entry.id)
        if entry.metadata:
            data["metadata"].append(entry.metadata)
        if entry.status:
            data["status"].append(entry.status)
        if entry.event_timestamp:
            data["event_timestamp"].append(entry.event_timestamp)
        if entry.metrics:
            data["metrics"].append(entry.metrics)
        if entry.search_keywords:
            data["search_keywords"].append(entry.search_keywords)
    return jsonify(data)
if __name__ == "__main__": 
    app.run(port=5000)
