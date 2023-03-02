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
# from predicate_induction import Predicate, PredicateInduction, infer_dtypes
import random
from predicates import Predicate, PredicateInduction, infer_dtypes, parse_value_string

from flask import Flask

api = Flask(__name__)
path = os.path.dirname(os.path.realpath(__file__))
my_path = 'static/data'


###Testing data/predicate loading###

data_path = 'static/data/superstore_data.csv'
predicates_path = 'static/data/augmented_superstore_predicates.json'
new_predicates_path = 'static/data/augmented_superstore_predicates_new.json'

data = pd.read_csv(f'{path}/{data_path}')
data.columns = [col.replace(' ', '-') for col in data.columns]
data['precipitation'] = np.random.uniform(0, 10, size=data.shape[0])
data['temperature'] = np.random.normal(60, 10, size=data.shape[0])

dtypes = infer_dtypes(data)
for col in data.columns:
    if dtypes[col] == 'date':
        data[col] = pd.to_datetime(data[col])
with open(f'{path}/{predicates_path}', 'r') as f:
    predicate_dicts = json.load(f)
# predicate_dicts = {k:v for k,v in predicate_dicts.items() if k not in ('3','4','5')}
numeric = [attr for attr in dtypes['numeric'] if attr != 'iforest_score']

predicates = [Predicate(data, dtypes, attribute_values=predicate_dict) for predicate_dict in predicate_dicts.values()]

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
    pivots = {attr: predicate.pivot(attr) for attr in predicate.predicate_attributes} if predicate is not None else None
    
    predicate_data = {
        'features': features,
        'predicate_id': predicate_id,
        'predicate_scores': predicate.get_distribution(target, num_bins=25, include_compliment=True).fillna(0).to_dict('records'),
        # 'predicate_scores': target.to_frame().rename(columns={0: 'score'}).assign(predicate=predicate.mask).to_dict('records') if predicate is not None else None,
        'attribute_score_data': {attr: pivot.get_plot_data_text(target, max_bins=int(num_pivot_bins), to_dict=True) for attr,pivot in pivots.items()}  if predicate is not None else None,
        'attribute_data': {attr: {num_attr: pivot.get_plot_data_text(num_attr, max_bins=int(num_pivot_bins), to_dict=True) for num_attr in numeric if num_attr != attr} for attr,pivot in pivots.items()}  if predicate is not None else None
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

@api.route('/add_predicate', methods=['GET', 'POST'])
def add_predicate():
    attribute_values = request.args.to_dict()

    # attribute_values = json.loads(pred).to_dict()
    # json.loads(pred)
   
    # print('pred', json.loads(pred))
    predicate = Predicate(data, dtypes, **{k: parse_value_string(v, dtypes[k]) for k,v in attribute_values.items()})
    print(predicate)
    predicates.append(predicate)
    
    target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = {i: predicates[i].to_dict_dist(target_, num_bins=25, include_compliment=True) for i in range(len(predicates))}
    return predicates_dict
    # with open(f"{path}/{new_predicates_path}", 'wb') as f:
    #     json.dump(predicates_dict, f)

@api.route('/edit_predicate/<predicate_id>/<negate>', methods=['GET', 'POST'])
def edit_predicate(predicate_id, negate=0):
    predicate_id = int(predicate_id)
    attribute_values = request.args.to_dict()
    predicate = Predicate(data, dtypes, **{k: parse_value_string(v, dtypes[k]) for k,v in attribute_values.items()})
    predicate.is_negated = bool(int(negate))
    predicates[predicate_id] = predicate

    target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = {i: predicates[i].to_dict_dist(target_, num_bins=25, include_compliment=True) for i in range(len(predicates))}
    return predicates_dict

@api.route('/delete_predicate/<predicate_id>', methods=['GET', 'POST'])
def delete_predicate(predicate_id):
    predicate_id = int(predicate_id)
    del predicates[predicate_id]
    target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = {i: predicates[i].to_dict_dist(target_, num_bins=25, include_compliment=True) for i in range(len(predicates))}
    return predicates_dict

@api.route('/copy_predicate/<predicate_id>', methods=['GET', 'POST'])
def copy_predicate(predicate_id):
    predicate_id = int(predicate_id)
    predicates.append(predicates[predicate_id])
    target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = {i: predicates[i].to_dict_dist(target_, num_bins=25, include_compliment=True) for i in range(len(predicates))}
    return predicates_dict

if __name__ == "__main__":
    api.run(host='localhost',port=5000)