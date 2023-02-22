from flask import Flask, render_template, request
import os
import json
import pandas as pd
import numpy as np
# from predicates import PredicateControl 
import edit_predicates
import plot_pred
from predicate_induction_main import Predicate
import pickle
from predicate_display import PredicateDisplay, PredicateEntry

feat_val = [{'Sub-Category': ['Copiers']}, {'Sub-Category': ['Machines']}, {'Sub-Category': ['Tables']}, {'State': ['New York', 'Massachusetts', 'New Jersey'], 'Segment': ['Consumer', 'Home Office'], 'Order-Date': ['2016-11-08', '2017-01-21']}, {'precipitation': [2.754, 5.891], 'temperature': [-0.0909, 36.361], 'Segment': ['Consumer', 'Home Office']}, {'State': ['Vermont'], 'Order-Date': ['2015-08-08', '2015-11-13']}, {'State': ['Vermont'], 'Segment': ['Corporate']}]


my_path = 'static/data'
path = os.path.dirname(os.path.realpath(__file__))
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


def load_dtypes(dtypes_path):
    with open(f"{path}/{dtypes_path}", 'r') as f:
        dtypes = json.load(f)
    return dtypes

def load_data(data_path, dtypes):
    data = pd.read_csv(f'{path}/{data_path}')
    for k, v in dtypes.items():
        if k in data.columns and v == 'date':
            data[k] = pd.to_datetime(data[k])
    return data

def load_predicates(predicates_path):
    with open(f"{path}/{predicates_path}", 'rb') as f:
        predicates = pickle.load(f)
    return predicates

def save_predicates(predicates, predicates_path):
    with open(f"{path}/{predicates_path}", 'wb') as f:
        pickle.dump(predicates, f)
    return predicates

def load_predicate_id(predicate_id_path):
    with open(f"{path}/{predicate_id_path}", 'r') as f:
        predicate_id = json.load(f)['predicate_id']
    return predicate_id

def save_predicate_id(predicate_id, predicate_id_path):
    with open(f"{path}/{predicate_id_path}", 'w') as f:
        json.dump({'predicate_id': predicate_id}, f)

def get_hist_data(data, target, predicates, num_bins=25):
    df_list = []
    for i in range(len(predicates)):
        predicate = predicates[i]
        counts, bins = np.histogram(data.loc[predicate.mask, target], bins=num_bins)
        density = counts / counts.sum()
        bins = (bins[:-1] + bins[1:]) / 2
        df_list.append(pd.DataFrame({'bin': bins, 'density': density}).assign(predicate_id=i))
    df = pd.concat(df_list)
    return df


def plot_predicates(predicates, target, num_bins=25, hover_id=None):
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    hist = pd.concat([predicates[i].get_distribution(data[target], num_bins).assign(predicate_id=i) for i in predicates.keys()])

  
    # hist.to_csv('out.csv', index=False) 

    """
    ADD THE HIST PARSING HERE"""

    grp = hist.groupby('predicate_id')
    keys = grp.groups.keys()
    job = {}
    for k in list(keys):
        pred_val_array = []
        pred_group = grp.get_group(k)
        
        for i in pred_group.index:
            tet = pred_group.loc[i].to_dict()
            pred_val_array.append(tet)
        
        job[k] = pred_val_array
    
    return job


    # if hover_id is not None:
    #     hist['hover_id'] = (hist.predicate_id == int(hover_id)).astype(int)
    # if hover_id is None:
    #     range_ = [colors[i] for i in predicates.keys()]
    #     color_encoding = alt.Color('predicate_id', scale=alt.Scale(domain=list(predicates.keys()), range=range_), legend=None)
    #     opacity_encoding = .5
    # else:
    #     range_ = ['#919191', colors[int(hover_id)]]
    #     color_encoding = alt.Color('hover_id', scale=alt.Scale(domain=[0, 1], range=range_), legend=None)
    #     opacity_encoding = .5
    # spec = json.loads(alt.Chart(hist).mark_bar().encode(
    #     x='bin',
    #     y='density',
    #     color=color_encoding,
    # ).configure_mark(
    #     opacity=opacity_encoding,
    # ).configure_scale(bandPaddingInner=0).to_json())
    # spec['width'] = 'container'
    # spec['height'] = 'container'
    # return spec

def plot_predicate(predicate, x_feature, target_features, hover_id=None):
    filter = predicate.feature_mask[[col for col in predicate.feature_mask.columns if col != x_feature]].all(axis=1)
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    d = pd.melt(data.loc[filter], x_feature, target_features)
  
    if dtypes[x_feature] == 'nominal':
        x_encoding = f'{x_feature}:O'
    else:
        x_encoding = alt.X(f"{x_feature}:Q", bin=True)
    if hover_id is None:
        color=f'variable:N'
    else:
        color = f'variable={hover_id}:N'
    spec = json.loads(alt.Chart(d).mark_bar().encode(
        x=x_encoding,
        y=f'mean(value):Q',
        color=color,
    ).to_json())
    spec['width'] = 'container'
    spec['height'] = 'container'
    return spec

"""
This is throwing a key error on superstore data
"""
def parse_feature_values(feature, values, dtypes):
    if dtypes[feature] == 'numeric':
        values = [float(values[0]), float(values[1])]
    elif dtypes[feature] == 'ordinal':
        values = [int(values[0]), int(values[1])]
    elif dtypes[feature] == 'date':
        values = [pd.to_datetime(values[0]), pd.to_datetime(values[1])]
    return values

def get_feature_domain(feature, data, dtype):
    if dtype == 'nominal':
        return data[feature].unique().tolist()
    else:
        return [data[feature].min(), data[feature].max()]

def get_feature_domains(features, data, dtypes):
    return {f: get_feature_domain(f, data, dtypes[f]) for f in features}

def calc_domains(predicate_id, new_predicates, data, dtypes):
    feature_values = {i+predicate_id: new_predicates[i].feature_values for i in range(len(new_predicates))}
    feature_domains = {k: get_feature_domains(v.keys(), data, dtypes) for k,v in feature_values.items()}
    for k, v in feature_domains.items():
        for ki, vi in v.items():
            if dtypes[ki] == 'date':
                feature_domains[k][ki] = [str(vi[0]).split(' ')[0], str(vi[1]).split(' ')[0]]

    return feature_domains
""" 
THIS IS CALLED ON INIT??

"""
def get_pred_distribution_data(feature_values, all_predicates):

    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)

    if all_predicates is None:
        all_predicates = load_predicates(predicates_path)
  
    hidden_predicates = all_predicates['hidden']
    archived_predicates = all_predicates['archived']
    predicates = all_predicates['default']

    predicate_id = load_predicate_id(predicate_id_path)
    parsed_feature_values = [{feature: parse_feature_values(feature, values, dtypes) for feature, values in f.items()} for f in feature_values]
    new_predicates = [Predicate(f, dtypes) for f in parsed_feature_values]
    for predicate in new_predicates:
        for k, v in predicate.feature_values.items():
            if dtypes[k] == 'date':
                predicate.feature_values[k] = [str(v[0]).split(' ')[0], str(v[1]).split(' ')[0]]

    for i in range(len(new_predicates)):
        new_predicates[i].fit(data)
        predicates[i+predicate_id] = new_predicates[i]
    all_predicates = {'default': predicates, 'hidden': hidden_predicates, 'archived': archived_predicates}

    domains = calc_domains(predicate_id, new_predicates, data, dtypes)
    # if other_predicates is not None:
    #     for k,v in other_predicates.items():
    #         all_predicates[k] = v
    save_predicate_id(predicate_id + len(new_predicates), predicate_id_path)
    save_predicates(all_predicates, predicates_path)
    hist = pd.concat([predicates[i].get_distribution(data[target], num_bins).assign(predicate_id=i) for i in predicates.keys()])

    grp = hist.groupby('predicate_id')
    keys = grp.groups.keys()
    job = {}
    for k in list(keys):
        pred_val_array = []
        pred_group = grp.get_group(k)
        
        for i in pred_group.index:
            tet = pred_group.loc[i].to_dict()
            pred_val_array.append(tet)
        
        job[k] = pred_val_array
    
    # return {'data_distributions': job, 'feature_domains': domains}
    return job



def update_predicates(predicates, new_predicates, hidden_predicates, archived_predicates, data, dtypes, predicate_id, other_predicates=None, hover_id=None):
    for i in range(len(new_predicates)):
        new_predicates[i].fit(data)
        predicates[i+predicate_id] = new_predicates[i]
    all_predicates = {'default': predicates, 'hidden': hidden_predicates, 'archived': archived_predicates}
    if other_predicates is not None:
        for k,v in other_predicates.items():
            all_predicates[k] = v
    save_predicate_id(predicate_id + len(new_predicates), predicate_id_path)
    save_predicates(all_predicates, predicates_path)
    spec = plot_predicates(predicates, target, num_bins, hover_id)
   
    # new_display = {i+predicate_id: PredicateDisplay(i+predicate_id, colors[i+predicate_id], new_predicates[i].feature_values, dtypes).display() for i in range(len(new_predicates))}
    feature_values = {i+predicate_id: new_predicates[i].feature_values for i in range(len(new_predicates))}
    feature_domains = {k: get_feature_domains(v.keys(), data, dtypes) for k,v in feature_values.items()}
    for k, v in feature_domains.items():
        for ki, vi in v.items():
            if dtypes[ki] == 'date':
                feature_domains[k][ki] = [str(vi[0]).split(' ')[0], str(vi[1]).split(' ')[0]]

    # with open(f"{path}/test-spec.json", 'w') as f:
    #     json.dump(spec, f)

    print('feeeeee',feature_domains)
    return {'plot': spec, 'feature_values': feature_values, 'feature_domains': feature_domains, 'dtypes': dtypes}
    # return {'plot': spec, 'display': new_display, 'feature_values': feature_values, 'feature_domains': feature_domains, 'dtypes': dtypes}

def add_predicates(feature_values, all_predicates=None):
    if all_predicates is None:
        all_predicates = load_predicates(predicates_path)
    keys = list(all_predicates.keys())
    hidden_predicates = all_predicates['hidden']
    archived_predicates = all_predicates['archived']
    predicates = all_predicates['default']
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)

    predicate_id = load_predicate_id(predicate_id_path)
    parsed_feature_values = [{feature: parse_feature_values(feature, values, dtypes) for feature, values in f.items()} for f in feature_values]
    new_predicates = [Predicate(f, dtypes) for f in parsed_feature_values]
    for predicate in new_predicates:
        for k, v in predicate.feature_values.items():
            if dtypes[k] == 'date':
                predicate.feature_values[k] = [str(v[0]).split(' ')[0], str(v[1]).split(' ')[0]]

    # print(feature_values)
    return update_predicates(predicates, new_predicates, hidden_predicates, archived_predicates, data, dtypes, predicate_id, {k: all_predicates[k] for k in keys if k not in ['hidden', 'archived', 'default']})

def add_predicate(feature_values, all_predicates=None):
    return add_predicates([feature_values], all_predicates)

def copy_predicate(predicate_id):
    predicates = load_predicates(predicates_path)
    predicate = predicates['default'][int(predicate_id)]
    return add_predicate(predicate.feature_values, predicates)

def delete_predicate(predicate_id):
    all_predicates = load_predicates(predicates_path)
    keys = list(all_predicates.keys())
    hidden_predicates = all_predicates['hidden']
    archived_predicates = all_predicates['archived']
    predicates = all_predicates['default']
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    all_predicate_id = load_predicate_id(predicate_id_path)
    return update_predicates({k:v for k,v in predicates.items() if k!=predicate_id}, [], hidden_predicates, archived_predicates, data, dtypes, all_predicate_id, {k: all_predicates[k] for k in keys if k not in ['hidden', 'archived', 'default']})

def negate_predicate(predicate_id):
    all_predicates = load_predicates(predicates_path)
    keys = list(all_predicates.keys())
    hidden_predicates = all_predicates['hidden']
    predicates = all_predicates['default']
    archived_predicates = all_predicates['archived']
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    predicates[int(predicate_id)].negate()
    all_predicate_id = load_predicate_id(predicate_id_path)
    return update_predicates(predicates, [], hidden_predicates, archived_predicates, data, dtypes, all_predicate_id, {k: all_predicates[k] for k in keys if k not in ['hidden', 'archived', 'default']})

def hide_predicates(predicate_ids, hide=False):
    predicates = load_predicates(predicates_path)
    keys = list(predicates.keys())
    for predicate_id in predicate_ids:
        key = int(predicate_id)
        if key in predicates['default']:
            predicates['hidden'][key] = predicates['default'][key]
            del predicates['default'][key]
        else:
            if not hide:
                predicates['default'][key] = predicates['hidden'][key]
                del predicates['hidden'][key]
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    all_predicate_id = load_predicate_id(predicate_id_path)
    return update_predicates(predicates['default'], [], predicates['hidden'], predicates['archived'], data, dtypes, all_predicate_id, {k: predicates[k] for k in keys if k not in ['hidden', 'archived', 'default']})

def hide_predicate(predicate_id, hide=False):
    return hide_predicates([predicate_id])

def hover_predicate(predicate_id):
    predicates = load_predicates(predicates_path)
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    all_predicate_id = load_predicate_id(predicate_id_path)
    return update_predicates(predicates['default'], [], predicates['hidden'], predicates['archived'], data, dtypes, all_predicate_id, None, predicate_id)

def focus_predicate(predicate_id):
    predicates = load_predicates(predicates_path)
    if predicate_id is None:
        if 'focus_hidden' in predicates:
            for k,v in predicates['focus_hidden'].items():
                predicates['default'][k] = v
        else:
            predicates['focus_hidden'] = {}
    else:
        predicates['focus_hidden'] = {}
        key = int(predicate_id)
        for k,v in predicates['default'].items():
            if k != key:
                predicates['hidden'][k] = v
                predicates['focus_hidden'][k] = v
        predicates['default'] = {key: predicates['default'][key]}
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    all_predicate_id = load_predicate_id(predicate_id_path)
    return update_predicates(predicates['default'], [], predicates['hidden'], predicates['archived'], data, dtypes, all_predicate_id, {'focus_hidden': predicates['focus_hidden']})

def update_predicate_clause(predicate_id, feature, values):
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    all_predicate_id = load_predicate_id(predicate_id_path)
    predicates = load_predicates(predicates_path)
    predicate = predicates['default'][int(predicate_id)]
    predicate.refit(data, feature, values)
    predicates['default'][int(predicate_id)] = predicate    
    return update_predicates(predicates['default'], [], predicates['hidden'], predicates['archived'], data, dtypes, all_predicate_id)

def inspect_predicate_feature(predicate_id, feature, features, predicates=None):
    if predicates is None:
        predicates = load_predicates(predicates_path)['default']
    predicate = predicates[int(predicate_id)]
    spec = plot_predicate(predicate, feature, target_features)
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    feature_domains = get_feature_domains(dtypes.keys(), data, dtypes)
    feature_values = predicate.feature_values
    return {'plot': spec, 'display': None, 'features': features, 'feature_domains': feature_domains, 'feature_values': feature_values,'dtypes': dtypes}

def archive_predicate(predicate_id):
    key = int(predicate_id)
    predicates = load_predicates(predicates_path)
    if key in predicates['default']:
        predicates['archived'][key] = predicates['default'][key]
        del predicates['default'][key]
    else:
        predicates['default'][key] = predicates['archived'][key]
        del predicates['archived'][key]
    if 'focus_hidden' in predicates:
        for k,v in predicates['focus_hidden'].items():
            predicates['default'][k] = v
        predicates['focus_hidden'] = {}
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    all_predicate_id = load_predicate_id(predicate_id_path)
    
    print(predicates)
    return update_predicates(predicates['default'], [], predicates['hidden'], predicates['archived'], data, dtypes, all_predicate_id, {k: predicates[k] for k in predicates.keys() if k not in ['hidden', 'archived', 'default']})
