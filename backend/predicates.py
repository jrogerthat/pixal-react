import pickle
import json

class PredicateControl:

    def __init__(self, path):
        self.path = path

    def load_predicates(self, predicates_path):
        print("reaching predicates", f"{self.path}/{predicates_path}")
        with open(f"{self.path}/{predicates_path}", 'rb') as f:
            print('FFF',f) 
            # change this from pickle
            predicates = pickle.load(f)
        return predicates

    def save_predicates(self, predicates, predicates_path):
        with open(f"{self.path}/{predicates_path}", 'wb') as f:
            pickle.dump(predicates, f)
        return predicates

    def load_predicate_id(self, predicate_id_path):
        with open(f"{self.path}/{predicate_id_path}", 'r') as f:
            predicate_id = json.load(f)['predicate_id']
        return predicate_id

    def save_predicate_id(self, predicate_id, predicate_id_path):
        with open(f"{self.path}/{predicate_id_path}", 'w') as f:
            json.dump({'predicate_id': predicate_id}, f)

