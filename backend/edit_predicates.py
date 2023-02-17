import json


def load_predicate_data(path, predicates_path):
    print("reaching predicates", f"{path}/{predicates_path}")
    with open(f"{path}/{predicates_path}", 'rb') as f:
        
        predicates = json.load(f)
        
    return predicates

def save_predicates(path, predicates, predicates_path):
    with open(f"{path}/{predicates_path}", 'wb') as f:
        json.dump(predicates, f)
    return predicates

# def load_predicate_id(self, predicate_id_path):
#     with open(f"{self.path}/{predicate_id_path}", 'r') as f:
#         predicate_id = json.load(f)['predicate_id']
#     return predicate_id

# def save_predicate_id(self, predicate_id, predicate_id_path):
#     with open(f"{self.path}/{predicate_id_path}", 'w') as f:
#         json.dump({'predicate_id': predicate_id}, f)
