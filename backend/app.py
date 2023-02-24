# from copyreg import pickle
from flask import Flask, render_template, request, session
import os
import json
import pandas as pd
import numpy as np
# from predicates import PredicateControl 
import edit_predicates
# import plot_pred
# from predicate_induction_main import Predicate
import all_fun
from predicate_induction import Predicate, PredicateInduction, infer_dtypes
import random

from flask import Flask

api = Flask(__name__)
path = os.path.dirname(os.path.realpath(__file__))
my_path = 'static/data'


###Testing data/predicate loading###

data_path = 'static/data/superstore_data.csv'
predicates_path = 'static/data/augmented_superstore_predicates.json'

data = pd.read_csv(f'{path}/{data_path}')
dtypes = infer_dtypes(data)
with open(f'{path}/{predicates_path}', 'r') as f:
    predicate_dicts = json.load(f)
predicate_dicts = {k:v for k,v in predicate_dicts.items() if k not in ('3','4','5')}
numeric = [attr for attr in dtypes['numeric'] if attr != 'iforest_score']

predicates = [Predicate(data, dtypes, attribute_values=predicate_dict) for _,predicate_dict in predicate_dicts.items()]

# session['data'] = {'data': data, 'dtypes': dtypes}
# session['predicates'] = {'predicates': predicates}

####################################

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
   pass

# @api.route("/load_test_score")
# def load_test_score():
#     job = []
#     with open(f"static/data/test_pred_score.json", 'rb') as f:
#         scores = json.load(f)
#         for ob in scores["scores_test"]:
#             ob["density"] = random.randrange(0, 8) * .1
#             job.append(ob)
#     finob = {}
#     finob["predicate_scores"] = job
#     print('firing dat load')
#     return finob

@api.route('/load_predicates_dist_list')
def load_predicates_dist_list():
    job = {}
    job['pred_list'] = edit_predicates.load_predicate_data(my_path, 'augmented_superstore_predicates.json')

    pred = all_fun.save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
    all_fun.save_predicate_id(0, predicate_id_path)

    job['pred_dist'] = all_fun.get_pred_distribution_data(all_fun.feat_val, pred)
    print('FEATURES',features)
    return job

@api.route('/load_predicates')
def load_predicates():
    test = edit_predicates.load_predicate_data(my_path, 'augmented_superstore_predicates.json')
    print('FEATURES',features)
    return test

@api.route('/get_pred_dis')
def get_pred_dis():

    pred = all_fun.save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
    all_fun.save_predicate_id(0, predicate_id_path)

    return all_fun.get_pred_distribution_data(all_fun.feat_val, pred)

@api.route('/get_selected_data/<predicate_id>/<num_score_bins>/<num_pivot_bins>')
def get_selected_data(predicate_id, num_score_bins=50, num_pivot_bins=25):
    print('preddddd', int(predicate_id))
    # predicate_induction = session['predicate']['predicate_induction']
    # predicate = session['predicate']['predicates'][predicate_id]
    predicate = predicates[int(predicate_id)]

    # target = predicate_induction.target
    target = pd.Series(np.random.uniform(0, 1, size=data.shape[0]))
    # numeric = session['data']['dtypes']['numeric']
    pivots = {attr: predicate.pivot(attr) for attr in predicate.predicate_attributes}

    predicate_data = {
        'features': features,
        'predicate_id': predicate_id,
        'predicate_scores': target.to_frame().rename(columns={0: 'score'}).assign(predicate=predicate.mask).to_dict('records'),
        'attribute_score_data': {attr: pivot.get_plot_data(target, max_bins=num_pivot_bins).to_dict('records') for attr,pivot in pivots.items()},
        'attribute_data': {attr: {num_attr: pivot.get_plot_data(num_attr, max_bins=num_pivot_bins).to_dict('records') for num_attr in numeric if num_attr != attr} for attr,pivot in pivots.items()}
    }
    return predicate_data

#   '{"State": ["Vermont"], "Segment": ["Corporate"]}'

"""
These below are work in progress!
"""

@api.route("/add_predicates", methods=['PUT'])
def app_add_predicates():
    request_data = request.get_json(force=True)
    print('request_data', request_data)
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
    print('VALUES', attribute_values)
    predicate = Predicate(session['data']['data'], session['data']['dtypes'], attribute_values)
    predicate_id = len(session['predicate']['predicates'])
    session['predicate']['predicates'].append(predicate)
    
    predicates = load_predicate_data(path, predicates_path)
    predicates[predicate_id] = predicates
    save_predicates(path, predicates, predicates_path)
    return predicates

@api.route('/edit_predicate', methods=['POST'])
def edit_predicate(predicate_id, negate=False, attribute_values=None):
    pass

@api.route('/delete_predicate', methods=['POST'])
def delete_predicate():
    pass

@api.route('/copy_predicate', methods=['POST'])
def copy_predicate():
    pass

# res = get_selected_data(1, max_pivot_bins=25)
# print(res)

if __name__ == "__main__":
    api.run(host='localhost',port=5000)