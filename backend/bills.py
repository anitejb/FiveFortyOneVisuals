from flask import jsonify
import json

def get_bills_actions_count():
    with open("../processed_data/bills_prepped_actions.json") as f:
        return jsonify(json.loads(f.read()))

def get_policy_area():
    with open("../processed_data/policy_area.json") as f:
        return jsonify(json.loads(f.read()))
