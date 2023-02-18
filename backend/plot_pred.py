import json
import edit_predicates
import pandas as pd
import numpy as np
from predicate_induction_main import Predicate

path = 'static/data'
dtypes_path = 'dtypes.json'

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

# def get_pred_distribution_data(predicates, target, num_bins):
#     dtypes = load_dtypes(dtypes_path)
#     data = load_data('augmented_superstore_data.csv', dtypes)
#     hist = pd.concat([predicates[i].get_distribution(data[target], num_bins).assign(predicate_id=i) for i in predicates.keys()])

#     print(hist)
#     return hist
    
def load_dtypes(dtypes_path):
    with open(f"{path}/{dtypes_path}", 'r') as f:
        dtypes = json.load(f)
    return dtypes

# backend/static/data/augmented_superstore_data.csv
def load_data(data_path, dtypes):
    data = pd.read_csv(f'{path}/{data_path}')
    #  data = pd.read_csv(f'{path}/{data_path}')
    for k, v in dtypes.items():
        if k in data.columns and v == 'date':
            data[k] = pd.to_datetime(data[k])
    return data

def parse_feature_values(feature, values, dtypes):
    if dtypes[feature] == 'numeric':
        values = [float(values[0]), float(values[1])]
    elif dtypes[feature] == 'ordinal':
        values = [int(values[0]), int(values[1])]
    elif dtypes[feature] == 'date':
        values = [pd.to_datetime(values[0]), pd.to_datetime(values[1])]
    return values

def add_predicates(feature_values, all_predicates=None):
    if all_predicates is None:
        all_predicates = load_predicates(predicates_path)
    keys = list(all_predicates.keys())
    hidden_predicates = all_predicates['hidden']
    archived_predicates = all_predicates['archived']
    predicates = all_predicates['default']
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)

    parsed_feature_values = [{feature: parse_feature_values(feature, values, dtypes) for feature, values in f.items()} for f in feature_values]
    new_predicates = [Predicate(f, dtypes) for f in parsed_feature_values]
    for predicate in new_predicates:
        for k, v in predicate.feature_values.items():
            if dtypes[k] == 'date':
                predicate.feature_values[k] = [str(v[0]).split(' ')[0], str(v[1]).split(' ')[0]]

