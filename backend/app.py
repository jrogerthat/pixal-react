# from copyreg import pickle
from flask import Flask, render_template, request, session
import os
import json
import pandas as pd
# from predicates import PredicateControl 
import edit_predicates
import plot_pred
# from predicate_induction_main import Predicate
import all_fun

# from flask import Flask, request, 
from predicate_induction import Predicate, PredicateInduction, Anomaly, infer_dtypes, encode_data, get_predicates_from_data

from flask import Flask

api = Flask(__name__)
path = os.path.dirname(os.path.realpath(__file__))
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
# predicates_path = f'static/data/predicates_{session_id}.pkl'
predicates_path = 'augmented_superstore_predicates.json'
predicate_id_path = f'static/data/predicate_id_{session_id}.json'

"""
These work!
"""
@api.route("/")
def index():
    return "WORKING"

@api.route('/load_predicates')
def load_predicates():
    test = edit_predicates.load_predicate_data(my_path, 'augmented_superstore_predicates.json')
    print(test)
    return test


@api.route('/get_pred_dis')
def get_pred_hist():

    pred = all_fun.save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
    all_fun.save_predicate_id(0, predicate_id_path)

    return all_fun.get_pred_distribution_data(all.feat_val, pred)

@api.route('/get_selected_data')
def get_selected_data(predicate_id, num_score_bins=50, num_pivot_bins=25):
    predicate_induction = session['predicate']['predicate_induction']
    predicate = session['predicate']['predicates'][predicate_id]
    predicate_data = {
        'predicate_id': predicate_id,
        'predicate_scores': predicate.get_score_dist_data(predicate_induction.target, num_bins=num_score_bins).to_dict(), # [{'bin': 10, 'density': 0.23, 'predicate': False}, ...]
        'attribute_score_data': {
            attr: predicate.pivot(attr).get_plot_data(predicate_induction.target, num_bins=num_pivot_bins).to_dict() for attr in predicate.predicate_attributes
        }, # {'sales': [{'sales_bin': 10, 'avg_score': 100}, ...], ...}
        'attribute_data': {
            {attr: {num_attr: predicate.pivot(attr).get_plot_data(predicate_induction.target, num_bins=num_pivot_bins).to_dict() for num_attr in session['data']['dtypes']['numeric']} for attr in predicate.predicate_attributes}
        }, # {'sales': {'profit': [{'sales_bin': 10, 'avg_profit': 32.49}, ...], ...}, ...}
    }
    return predicate_data

#   '{"State": ["Vermont"], "Segment": ["Corporate"]}'

"""
These below are work in progress!
"""

@api.route("/add_predicates", methods=['PUT'])
def app_add_predicates():
    request_data = request.get_json(force=True)
    feature_values = request_data['feature_values']
    res = all_fun.add_predicates(feature_values)
    return json.dumps(res)


# @api.route('/add_predicate', methods=['POST'])
# def add_predicate():
#     test = request.json['pred']
#     print(test)
#     # return edit_predicates.save_predicate_data(data_path, 'augmented_superstore_predicates.json')
#     return test

def load_predicate_data(path, predicates_path):
    print("reaching predicates", f"{path}/{predicates_path}")
    with open(f"{path}/{predicates_path}", 'rb') as f:
        predicates = json.load(f)
    return predicates

def save_predicates(path, predicates, predicates_path):
    with open(f"{path}/{predicates_path}", 'wb') as f:
        json.dump(predicates, f)
    return predicates

@api.route('/add_predicate', methods=['POST'])
def add_predicate():
    attribute_values = request.json['pred']
    predicate = Predicate(session['data']['data'], session['data']['dtypes'], attribute_values)
    predicate_id = len(session['predicate']['predicates'])
    session['predicate']['predicates'].append(predicate)
    
    predicates = load_predicate_data(path, predicates_path)
    predicates[predicate_id] = predicates
    save_predicates(path, predicates, predicates_path)
    return predicates

@api.route('/edit_predicate', methods=['POST'])
def edit_predicate():
    pass

@api.route('/delete_predicate', methods=['POST'])
def delete_predicate():
    pass

@api.route('/copy_predicate', methods=['POST'])
def copy_predicate():
    pass


if __name__ == "__main__":
    api.run(host='localhost',port=5000)