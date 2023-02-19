# from copyreg import pickle
from flask import Flask, render_template, request
import os
import json
import pandas as pd
# from predicates import PredicateControl 
import edit_predicates
import plot_pred
from predicate_induction_main import Predicate
import all


from flask import Flask

api = Flask(__name__)

my_path = 'static/data'

colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#7f7f7f", "#17becf", "#bcbd22"]

data_read = open(f"static/data/data_master_augmented_superstore.json", 'r')
data_paths = json.load(data_read)
data_path = data_paths["csv_data"]
dtypes_path = data_paths["data_types"]

feature_read = open(f'{dtypes_path}', 'r')
feature_test = json.load(feature_read)

target = 'iforest_score'
features = list(feature_test.keys())

num_bins = 100

session_id = "49324312"
predicates_path = f'static/data/predicates_{session_id}.pkl'
predicate_id_path = f'static/data/predicate_id_{session_id}.json'

"""
These work!
"""
@api.route("/")
def index():
    return "WORKING"

@api.route('/load_predicates')
def load_predicates():
    return edit_predicates.load_predicate_data(my_path, 'augmented_superstore_predicates.json')


@api.route('/get_pred_dis')
def get_pred_hist():

    pred = all.save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
    all.save_predicate_id(0, predicate_id_path)

    return all.get_pred_distribution_data(all.feat_val, pred)

@api.route('/get_selected_data')
def get_selected_data():
    """
    Need to think about this function. Proposed impolementation:
    send the id of the predicate. op send a feature.
    keep track of predicate, feature, if feature, explanation.

    """
    return "test"

    # {'predicate': '01',
    # predicate_scores : {pred: [], other: []
    # 'feature_data': []
    # feature: {feature: '', value: ''}


    # }
    
    # }


  '{"State": ["Vermont"], "Segment": ["Corporate"]}'

"""
These below are work in progress!
"""

@api.route("/add_predicates", methods=['PUT'])
def app_add_predicates():
    request_data = request.get_json(force=True)
    feature_values = request_data['feature_values']
    res = all.add_predicates(feature_values)
    return json.dumps(res)


@api.route('/add_predicate', methods=['POST'])
def add_predicate():
    test = request.json['pred']
    print(test)
    # return edit_predicates.save_predicate_data(data_path, 'augmented_superstore_predicates.json')
    return test


