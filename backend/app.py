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
from flask import Flask
from predicates import Predicate, PredicateInduction, infer_dtypes, parse_value_string, JZS
from flask_cors import CORS


# app = Flask(__name__)
# CORS(app)

# name = 'superstore'
# name = 'healthcare'
name = 'transactions'

api = Flask(__name__)
CORS(api)
path = os.path.dirname(os.path.realpath(__file__))
exec(f'from static.data.{name}_config import get_data')
data, predicates_path, target, dtypes, numeric, target_name = get_data(path)

with open(f'{path}/{predicates_path}', 'r') as f:
    predicate_dicts = json.load(f).values()
predicates = [Predicate(data, {k:v for k,v in dtypes.items() if k in predicate_dict}, attribute_values=predicate_dict) for predicate_dict in predicate_dicts]

bf = JZS(side='right')
p = PredicateInduction(
    data, dtypes,
    target=target,
    score_func=bf,
)

colors = ["#6e40aa","#7140ab","#743fac","#773fad","#7a3fae","#7d3faf","#803eb0","#833eb0","#873eb1","#8a3eb2","#8d3eb2","#903db2","#943db3","#973db3","#9a3db3","#9d3db3","#a13db3","#a43db3","#a73cb3","#aa3cb2","#ae3cb2","#b13cb2","#b43cb1","#b73cb0","#ba3cb0","#be3caf","#c13dae","#c43dad","#c73dac","#ca3dab","#cd3daa","#d03ea9","#d33ea7","#d53ea6","#d83fa4","#db3fa3","#de3fa1","#e040a0","#e3409e","#e5419c","#e8429a","#ea4298","#ed4396","#ef4494","#f14592","#f34590","#f5468e","#f7478c","#f9488a","#fb4987","#fd4a85","#fe4b83","#ff4d80","#ff4e7e","#ff4f7b","#ff5079","#ff5276","#ff5374","#ff5572","#ff566f","#ff586d","#ff596a","#ff5b68","#ff5d65","#ff5e63","#ff6060","#ff625e","#ff645b","#ff6659","#ff6857","#ff6a54","#ff6c52","#ff6e50","#ff704e","#ff724c","#ff744a","#ff7648","#ff7946","#ff7b44","#ff7d42","#ff8040","#ff823e","#ff843d","#ff873b","#ff893a","#ff8c38","#ff8e37","#fe9136","#fd9334","#fb9633","#f99832","#f89b32","#f69d31","#f4a030","#f2a32f","#f0a52f","#eea82f","#ecaa2e","#eaad2e","#e8b02e","#e6b22e","#e4b52e","#e2b72f","#e0ba2f","#debc30","#dbbf30","#d9c131","#d7c432","#d5c633","#d3c934","#d1cb35","#cece36","#ccd038","#cad239","#c8d53b","#c6d73c","#c4d93e","#c2db40","#c0dd42","#bee044","#bce247","#bae449","#b8e64b","#b6e84e","#b5ea51","#b3eb53","#b1ed56","#b0ef59","#adf05a","#aaf159","#a6f159","#a2f258","#9ef258","#9af357","#96f357","#93f457","#8ff457","#8bf457","#87f557","#83f557","#80f558","#7cf658","#78f659","#74f65a","#71f65b","#6df65c","#6af75d","#66f75e","#63f75f","#5ff761","#5cf662","#59f664","#55f665","#52f667","#4ff669","#4cf56a","#49f56c","#46f46e","#43f470","#41f373","#3ef375","#3bf277","#39f279","#37f17c","#34f07e","#32ef80","#30ee83","#2eed85","#2cec88","#2aeb8a","#28ea8d","#27e98f","#25e892","#24e795","#22e597","#21e49a","#20e29d","#1fe19f","#1edfa2","#1ddea4","#1cdca7","#1bdbaa","#1bd9ac","#1ad7af","#1ad5b1","#1ad4b4","#19d2b6","#19d0b8","#19cebb","#19ccbd","#19cabf","#1ac8c1","#1ac6c4","#1ac4c6","#1bc2c8","#1bbfca","#1cbdcc","#1dbbcd","#1db9cf","#1eb6d1","#1fb4d2","#20b2d4","#21afd5","#22add7","#23abd8","#25a8d9","#26a6db","#27a4dc","#29a1dd","#2a9fdd","#2b9cde","#2d9adf","#2e98e0","#3095e0","#3293e1","#3390e1","#358ee1","#378ce1","#3889e1","#3a87e1","#3c84e1","#3d82e1","#3f80e1","#417de0","#437be0","#4479df","#4676df","#4874de","#4a72dd","#4b70dc","#4d6ddb","#4f6bda","#5169d9","#5267d7","#5465d6","#5663d5","#5761d3","#595fd1","#5a5dd0","#5c5bce","#5d59cc","#5f57ca","#6055c8","#6153c6","#6351c4","#6450c2","#654ec0","#664cbe","#674abb","#6849b9","#6a47b7","#6a46b4","#6b44b2","#6c43af","#6d41ad","#6e40aa"]
session_id = "49324312"
predicate_id_path = f'static/data/predicate_id_{session_id}.json'
parent_dict = {}

@api.route('/get_pred_dis')
def get_pred_dis():
    pred = all_fun.save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
    all_fun.save_predicate_id(0, predicate_id_path)
    return all_fun.get_pred_distribution_data(all_fun.feat_val, pred, 100)

# @api.route('/get_feature_cat')
# def get_feature_cat():
#     test = pd.read_csv('static/data/augmented_superstore_data.csv')
#     return test['State']

@api.route('/get_selected_data/<predicate_id>')
def get_selected_data(predicate_id):
    # print('PREDICATE ID', predicate_id)
    # # print('predicates', predicates)
    # print('get_selected_data', flush=True)
    predicate = predicates[int(predicate_id)]
    print('predicate', predicate.predicate_attributes)
    pivots = {attr: predicate.pivot(attr) for attr in predicate.predicate_attributes} if predicate is not None else None

    print('PIVOTS', pivots)
    
    num_pivot_bins = 35
    num_score_bins = 40
    predicate_scores = predicate.get_distribution(target, num_bins=num_score_bins, include_compliment=True).dropna().to_dict('records')
    # print('PREDICATE SCORES',predicate_scores)
    attribute_data = {attr: {num_attr: pivot.get_plot_data_text(num_attr, max_bins=int(num_pivot_bins), to_dict=True) for num_attr in dtypes['numeric'] if num_attr not in predicate.attributes} for attr,pivot in pivots.items()}  if predicate is not None else None
    print('PREDICATE SCORES',predicate_scores)
    attribute_score_data = {attr: pivot.get_plot_data_text(target_name, max_bins=int(num_pivot_bins), to_dict=True) for attr,pivot in pivots.items()}  if predicate is not None else None
    for k,v in attribute_score_data.items():
        attribute_score_data[k] = ([{'score' if ki==target_name else ki: vi for ki,vi in r.items()} for r in v[0]], v[1])

    predicate_data = {
        'features': predicate.predicate_attributes,
        'predicate_id': predicate_id,
        'predicate_scores': predicate_scores,
        'attribute_score_data': attribute_score_data,
        'attribute_data': attribute_data
    }
    return predicate_data

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
    print('predicates',predicates)

    predicates_dict = {i: predicates[i].to_dict_dist(target, num_bins=num_bins, include_compliment=True) for i in range(len(predicates))}
    for k,v in predicates_dict.items():
       
        score = p.score(predicates[k])
        predicates_dict[k]['score'] = max(0, score)
       
        print('score', score)
    return predicates_dict

@api.route('/add_predicate', methods=['GET', 'POST'])
def add_predicate():
    attribute_values_str = list(request.args.to_dict().keys())[0]
    attribute_value_strs = [(a+']') for a in attribute_values_str.split(']')[:-1]]
    attribute_values_dict = dict([a.split(':') for a in attribute_value_strs])
    attribute_values = {k: parse_value_string(v, dtypes[k]) for k,v in attribute_values_dict.items()}
    predicate = Predicate(data, {k:v for k,v in dtypes.items() if k in attribute_values}, attribute_values=attribute_values)
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
        attribute_value = {k: parse_value_string(v, dtypes[k]) for k,v in attribute_values.items()}
        predicate = Predicate(data, {k:v for k,v in dtypes.items() if k in attribute_values}, attribute_values=attribute_values)
    predicate.is_negated = bool(int(negate))
    predicates[predicate_id] = predicate
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
    
    predicate = Predicate(data, {k:v for k,v in dtypes.items() if k in attribute_values}, attribute_values=attribute_values)
    print(predicate.attribute_mask.sum(axis=0))
    predicates[predicate_id] = predicate
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict

@api.route('/delete_predicate/<predicate_id>', methods=['GET', 'POST'])
def delete_predicate(predicate_id):
    predicate_id = int(predicate_id)
    del predicates[predicate_id]
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
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return {'predicates': predicates_dict, 'parent_dict':parent_dict}

@api.route('/get_predicate_data', methods=['GET', 'POST'])
def get_predicate_data():
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    test = pd.read_csv('static/data/transactions.csv')

    # transactions_json = test.to_json(orient='records')
    # Return the JSON data as a response
    # return jsonify(transactions_json)
    # print('PLEASE WORK IN GET PRED DATA', test, dtypes)
    dtype_ranges = {}

    for key in dtypes:
        if key != 'numeric':
            if dtypes[key] == 'numeric':
                dtype_ranges[key] = [str(test[key].min()), str(test[key].max())]
            elif dtypes[key] == 'nominal':
                dtype_ranges[key] = list(set(test[key]))
            elif dtypes[key] == 'date':
                dtype_ranges[key] = [str(test[key].min()), str(test[key].max())]

    return {'predicates': predicates_dict, 'parent_dict': parent_dict, 'dtypes': dtypes, 'dtype_ranges':dtype_ranges}

@api.route('/get_predicate_score', methods=['GET', 'POST'])
def get_predicate_score():
    predicates_dict = get_predicates_dict(predicates, target, num_bins=40)
    return predicates_dict

if __name__ == "__main__":
    api.run(host='localhost',port=5000)