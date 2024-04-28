import pandas as pd

def get_data(path):
    data_path = 'static/data/healthcare.csv'
    predicates_path = 'static/data/healthcare.json'

    data = pd.read_csv(f'{path}/{data_path}')
    print(data)
    data['modifier'] = data['modifier'].fillna('')
    target = data.lof
    dtypes = {
        'insurance': 'nominal',
        'procedure': 'nominal',
        'diagnosis': 'nominal',
        'modifier': 'nominal',
        'duration': 'numeric',
        'pdenial': 'numeric',
        'denied': 'numeric'
    }    
    dtypes['numeric'] = [k for k,v in dtypes.items() if v == 'numeric']
    numeric = dtypes['numeric']
    return data, predicates_path, target, dtypes, numeric, 'lof'