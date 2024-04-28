import pandas as pd

def get_data(path):
    data_path = 'static/data/superstore_data_vis23.csv'
    predicates_path = 'static/data/superstore_predicates_vis23.json'

    data = pd.read_csv(f'{path}/{data_path}')
    target = data.lof
    data['Order-Date'] = pd.to_datetime(data['Order-Date'])
    dtypes = {'Order-Date': 'date', 'Ship-Mode': 'nominal', 'Segment': 'nominal', 'State': 'nominal', 'Sub-Category': 'nominal', 'Quantity': 'numeric', 'Unit-Price': 'numeric', 'Unit-Cost': 'numeric', 'precipitation': 'numeric', 'temperature': 'numeric'}
    dtypes['numeric'] = [k for k,v in dtypes.items() if v == 'numeric']
    numeric = dtypes['numeric']
    return data, predicates_path, target, dtypes, numeric, 'lof'