# from copyreg import pickle
from flask import Flask, render_template, request
import os
import json
import pandas as pd
from predicates import PredicateControl 


# from predicate_display import PredicateDisplay, PredicateEntry
# from control import Control

from flask import Flask

api = Flask(__name__)

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body

@api.route('/load_predicates')
def load_predicates():
    pred = PredicateControl('static/data')
    return pred.load_predicates('augmented_superstore_predicates.json')

# def index():
#     save_predicates({'default': {}, 'hidden': {}, 'archived': {}}, predicates_path)
#     save_predicate_id(0, predicate_id_path)
#     y_select = Control(target_features).display()
#     return render_template("index.html", y_select=y_select)

    def load_data(data_path):
        data = pd.read_csv(f'{path}/{data_path}')
        return data

    def load_dtypes(dtypes_path):
        with open(f"{path}/{dtypes_path}", 'r') as f:
            dtypes = json.load(f)
        return dtypes

