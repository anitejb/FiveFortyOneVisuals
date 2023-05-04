from flask import jsonify
import json

def get_member_info_graph():
    return jsonify({"message": "Member Info Graph Here"})

def get_member_name_graph():
    return jsonify({"message": "Member Name Graph Here"})

def get_member_party_graph():
    return jsonify({"message": "Member Party Graph Here"})

def get_member_state_graph():
    with open("../processed_data/member_ages.json") as f:
        return jsonify(json.loads(f.read()))

def get_member_leg_count_graph():
    with open("../processed_data/leg_count.json") as f:
        return jsonify(json.loads(f.read()))