# from copyreg import pickle
from flask import Flask, render_template, request
import os
import json
import pandas as pd
# from predicates import PredicateControl 
import edit_predicates

# from predicate_display import PredicateDisplay, PredicateEntry
# from control import Control

from flask import Flask

api = Flask(__name__)

data_path = 'static/data'


@api.route('/load_predicates')
def load_predicates():
    return edit_predicates.load_predicate_data(data_path, 'augmented_superstore_predicates.json')

@api.route('/load_spec')
def load_spec():
    return edit_predicates.load_predicate_data(data_path, 'test-spec.json')

@api.route('/add_predicate', methods=['POST'])
def add_predicate(pred):
    print(pred)
    return edit_predicates.save_predicate_data(data_path, 'augmented_superstore_predicates.json')
# def index():
#     save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
#     save_predicate_id(0, predicate_id_path)
#     y_select = Control(target_features).display()
#     return render_template("index.html", y_select=y_select)

    # def load_data(data_path):
    #     data = pd.read_csv(f'{path}/{data_path}')
    #     return data

    # def load_dtypes(dtypes_path):
    #     with open(f"{path}/{dtypes_path}", 'r') as f:
    #         dtypes = json.load(f)
    #     return dtypes

