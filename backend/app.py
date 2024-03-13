# from copyreg import pickle
from flask import Flask, render_template, request, session
import os
import json
import pandas as pd
import numpy as np
from sklearn.neighbors import LocalOutlierFactor
import copy
import edit_predicates
import all_fun
import random
from predicates import Predicate, PredicateInduction, infer_dtypes, parse_value_string, JZS

from flask import Flask

# data_path = 'static/data/cars.csv'
# predicates_path = 'static/data/cars.json'
# target_path = 'static/data/cars_iforest.csv'

# data_path = 'static/data/augmented_superstore_data.csv'
# predicates_path = 'static/data/augmented_superstore_predicates.json'

# target_path = 'static/data/cars_iforest.csv'

data_path = 'static/data/superstore_data_vis23.csv'
predicates_path = 'static/data/superstore_predicates_vis23.json'

api = Flask(__name__)
path = os.path.dirname(os.path.realpath(__file__))
data = pd.read_csv(f'{path}/{data_path}')

target = data.lof
# data = data.drop('lof', axis=1)
# lof = LocalOutlierFactor(n_neighbors=50).fit(data[['Quantity', 'Unit-Price', 'Unit-Cost']])
# target = pd.Series(-lof.negative_outlier_factor_)

# data = data.drop('lof', axis=1)
# target = data.iforest_score
# data = data.drop('iforest_score', axis=1)

# data = data.rename(columns={'Date': 'Order-Date'})#, 'Temperature': 'temperature', 'Precipitation': 'precipitation'})
data['Order-Date'] = pd.to_datetime(data['Order-Date'])
# data['Order-Date'] = pd.to_datetime(data['Order-Date'])

# dtypes = {'Order-Date': 'date',
#  'State': 'nominal',
#  'Segment': 'nominal',
#  'Temperature': 'numeric',
#  'Precipitation': 'numeric',
#  'Quantity': 'numeric',
#  'Sales': 'numeric',
#  'Profit': 'numeric'}
dtypes = {'Order-Date': 'date', 'Ship-Mode': 'nominal', 'Segment': 'nominal', 'State': 'nominal', 'Sub-Category': 'nominal', 'Quantity': 'numeric', 'Unit-Price': 'numeric', 'Unit-Cost': 'numeric', 'precipitation': 'numeric', 'temperature': 'numeric'}
# dtypes['Date'] = 'date'
# dtypes['Precipitation'] = 'numeric'
# dtypes['Temperature'] = 'numeric'
# dtypes['Profit'] = 'numeric'
# dtypes['Sales'] = 'numeric'
dtypes['numeric'] = [k for k,v in dtypes.items() if v == 'numeric']
numeric = dtypes['numeric']

# api = Flask(__name__)
# path = os.path.dirname(os.path.realpath(__file__))
# data = pd.read_csv(f'{path}/{data_path}')
# target = data.iforest_score
# data = data.drop('iforest_score', axis=1)
# data['Order-Date'] = pd.to_datetime(data['Order-Date'])
# dtypes = {'Order-Date': 'date', 'Ship-Mode': 'nominal', 'Segment': 'nominal', 'State': 'nominal', 'Sub-Category': 'nominal', 'Quantity': 'ordinial', 'Unit-Price': 'numeric', 'Unit-Cost': 'numeric', 'precipitation': 'numeric', 'temperature': 'numeric'}
# dtypes['numeric'] = [k for k,v in dtypes.items() if v == 'numeric']

# dtypes = infer_dtypes(data)
# target = pd.read_csv(f'{path}/{target_path}')
# target = target[target.columns[0]]

with open(f'{path}/{predicates_path}', 'r') as f:
    predicate_dicts = json.load(f).values()
# predicate_dicts_ = []
# for predicate_dict in predicate_dicts:
#     predicate_dict_ = {}
#     for k,v in predicate_dict.items():
#         if k=='Date':
#             predicate_dict_['Order-Date'] = v
#         else:
#             predicate_dict_[k] = v
#     predicate_dicts_.append(predicate_dict_)
# predicate_dicts = predicate_dicts_

print(predicate_dicts)
predicates = [Predicate(data, dtypes, attribute_values=predicate_dict) for predicate_dict in predicate_dicts]#.values()]

bf = JZS(side='right')
p = PredicateInduction(
    data, dtypes,
    target=target,
    score_func=bf,
)

colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#7f7f7f", "#17becf", "#bcbd22"]

# data_read = open(f"static/data/data_master_augmented_superstore.json", 'r')
# data_paths = json.load(data_read)
# data_path = data_paths["csv_data"]
# dtypes_path = data_paths["data_types"]

# feature_read = open(f'{dtypes_path}', 'r')
# feature_test = json.load(feature_read)

# target = 'iforest_score'
# features = list(feature_test.keys())

# num_bins = 100

session_id = "49324312"
# # predicates_path = f'static/data/predicates_{session_id}.pkl'
# predicates_path = 'augmented_superstore_predicates.json'
predicate_id_path = f'static/data/predicate_id_{session_id}.json'

parent_dict = {}

@api.route('/get_pred_dis')
def get_pred_dis():
    pred = all_fun.save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
    all_fun.save_predicate_id(0, predicate_id_path)
    return all_fun.get_pred_distribution_data(all_fun.feat_val, pred, 100)

@api.route('/get_feature_cat')
def get_feature_cat():
    test = pd.read_csv('static/data/augmented_superstore_data.csv')
    #Segment,State,Sub-Category
    return test['State']

@api.route('/get_selected_data/<predicate_id>/<num_score_bins>/<num_pivot_bins>')
def get_selected_data(predicate_id, num_score_bins=25, num_pivot_bins=15):
    predicate = predicates[int(predicate_id)]
    pivots = {attr: predicate.pivot(attr) for attr in predicate.predicate_attributes} if predicate is not None else None
    
    num_pivot_bins = 35
    num_score_bins = 40
    predicate_scores = predicate.get_distribution(target, num_bins=num_score_bins, include_compliment=True).dropna().to_dict('records')

    attribute_data = {attr: {num_attr: pivot.get_plot_data_text(num_attr, max_bins=int(num_pivot_bins), to_dict=True) for num_attr in dtypes['numeric'] if num_attr != attr} for attr,pivot in pivots.items()}  if predicate is not None else None
    attribute_score_data = {attr: pivot.get_plot_data_text('lof', max_bins=int(num_pivot_bins), to_dict=True) for attr,pivot in pivots.items()}  if predicate is not None else None
    for k,v in attribute_score_data.items():
        attribute_score_data[k] = ([{'score' if ki=='lof' else ki: vi for ki,vi in r.items()} for r in v[0]], v[1])

    predicate_data = {
        'features': predicate.predicate_attributes,
        'predicate_id': predicate_id,
        'predicate_scores': predicate_scores,
        'attribute_score_data': attribute_score_data,
        'attribute_data': attribute_data
    }
    return predicate_data

#   '{"State": ["Vermont"], "Segment": ["Corporate"]}'

@api.route("/add_predicates", methods=['PUT'])
def app_add_predicates():
    request_data = request.get_json(force=True)
    print('request_data', request_data)
    feature_values = request_data['feature_values']
    res = all_fun.add_predicates(feature_values)
    return {'predicates': json.dumps(res), 'parent_dict': parent_dict}

def load_predicate_data(path, predicates_path):
    print("reaching predicates", f"{path}/{predicates_path}")
    with open(f"{path}/{predicates_path}", 'rb') as f:
        predicates = json.load(f)
    return predicates

def save_predicates(path, predicates, predicates_path):
    with open(f"{path}/{predicates_path}", 'wb') as f:
        json.dump(predicates, f)
    return predicates

def get_predicates_dict(predicates, target, num_bins=25):
    # bin_width  = .01
    # ranges = [(target[p.mask].max() - target[p.mask].min()) for p in predicates]
    # num_bins = [int(r**.1/bin_width) for r in ranges]
    # print(num_bins)

    # print(predicates)
    # num_bins = [100 if p.is_negated else 25 for p in predicates]
    # print(num_bins)
    print('predicates',predicates)

    predicates_dict = {i: predicates[i].to_dict_dist(target, num_bins=num_bins, include_compliment=True) for i in range(len(predicates))}
    for k,v in predicates_dict.items():
        score = p.score(predicates[k])
        predicates_dict[k]['score'] = max(0, score)
    return predicates_dict

@api.route('/add_predicate', methods=['GET', 'POST'])
def add_predicate():
    attribute_values_str = list(request.args.to_dict().keys())[0]#.replace(' ', '')
    attribute_value_strs = [(a+']') for a in attribute_values_str.split(']')[:-1]]
    attribute_values_dict = dict([a.split(':') for a in attribute_value_strs])
    attribute_values = {k: parse_value_string(v, dtypes[k]) for k,v in attribute_values_dict.items()}

    # print(attribute_values)
    # attribute_values = json.loads(pred).to_dict()
    # json.loads(pred)
   
    # print('pred', json.loads(pred))
    predicate = Predicate(data, dtypes, attribute_values=attribute_values)
    # print(predicate)
    predicates.append(predicate)
    
    target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict
    # with open(f"{path}/{new_predicates_path}", 'wb') as f:
    #     json.dump(predicates_dict, f)

@api.route('/edit_predicate/<predicate_id>/<negate>', methods=['GET', 'POST'])
def edit_predicate(predicate_id, negate=0):
    predicate_id = int(predicate_id)
    attribute_values = request.args.to_dict()
    if len(attribute_values) == 0:
        predicate = predicates[predicate_id]
    else:
        predicate = Predicate(data, dtypes, **{k: parse_value_string(v, dtypes[k]) for k,v in attribute_values.items()})
    predicate.is_negated = bool(int(negate))
    predicates[predicate_id] = predicate
    # pd.Series(np.random.normal(size=len(predicate.mask)))
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict

@api.route('/edit_predicate_clause', methods=['GET', 'POST'])
def edit_predicate_clause():
    attribute_values_str, predicate_id = list(request.args.to_dict().keys())[0].split(',"id":')#.replace(' ', '').split(',"id":')
    print(attribute_values_str)

    predicate_id = int(predicate_id[:-1].replace('"', '').replace("'", ''))
    attribute_values_str = attribute_values_str.split('"features":')[-1]

    attribute_value_strs = [(a+']').replace('"', '') for a in attribute_values_str.split(']')[:-1]]
    attribute_values_dict = dict([a.split(':') for a in attribute_value_strs])
    print(attribute_values_dict)

    attribute_values = {k.replace('{', '').replace(',', ''): parse_value_string(str(v), dtypes[k.replace('{', '').replace(',', '')]) for k,v in attribute_values_dict.items()}
    print(attribute_values)
    
    predicate = Predicate(data, dtypes, **attribute_values)
    print(predicate.attribute_mask.sum(axis=0))
    predicates[predicate_id] = predicate
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict

@api.route('/delete_predicate/<predicate_id>', methods=['GET', 'POST'])
def delete_predicate(predicate_id):
    predicate_id = int(predicate_id)
    del predicates[predicate_id]
    # target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict

@api.route('/copy_predicate/<predicate_id>', methods=['GET', 'POST'])
def copy_predicate(predicate_id):
    predicate_id = int(predicate_id)
    cop_ob = copy.deepcopy(predicates[predicate_id])
   
    if predicate_id in parent_dict.get(predicate_id, {}).keys():
        parent_dict[predicate_id].append(len(predicates))
    else:
        parent_dict[predicate_id] = []
        parent_dict[predicate_id].append(len(predicates))

    predicates.append(cop_ob)
    # target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return {'predicates': predicates_dict, 'parent_dict':parent_dict}

@api.route('/get_predicate_data', methods=['GET', 'POST'])
def get_predicate_data():
    # target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return {'predicates': predicates_dict, 'parent_dict':parent_dict}

@api.route('/get_predicate_score', methods=['GET', 'POST'])
def get_predicate_score():
    # target_ = pd.Series(np.random.normal(size=data.shape[0]))
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict

if __name__ == "__main__":
    api.run(host='localhost',port=5000)