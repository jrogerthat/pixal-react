import pickle
import json

class PredicateControl:

    def __init__(self, path):
        self.path = path

    def load_predicates(self, predicates_path):
        print("reaching predicates", f"{self.path}/{predicates_path}")
        with open(f"{self.path}/{predicates_path}", 'rb') as f:
            
            # change this from pickle
            predicates = json.load(f)
            print('preddddd',predicates)
            # pickle.load(f)
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


    """ 
    THIS IS CALLED ON INIT??

    """

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

        new_display = {i+predicate_id: PredicateDisplay(i+predicate_id, colors[i+predicate_id], new_predicates[i].feature_values, dtypes).display() for i in range(len(new_predicates))}
        feature_values = {i+predicate_id: new_predicates[i].feature_values for i in range(len(new_predicates))}
        feature_domains = {k: get_feature_domains(v.keys(), data, dtypes) for k,v in feature_values.items()}
        for k, v in feature_domains.items():
            for ki, vi in v.items():
                if dtypes[ki] == 'date':
                    feature_domains[k][ki] = [str(vi[0]).split(' ')[0], str(vi[1]).split(' ')[0]]
        return {'plot': spec, 'display': new_display, 'feature_values': feature_values, 'feature_domains': feature_domains, 'dtypes': dtypes}
