
def update_predicates(predicates, new_predicates, hidden_predicates, archived_predicates, data, dtypes, predicate_id, other_predicates=None, hover_id=None):
    for i in range(len(new_predicates)):
        new_predicates[i].fit(data)
        predicates[i+predicate_id] = new_predicates[i]
    all_predicates = {'default': predicates, 'hidden': hidden_predicates, 'archived': archived_predicates}
    if other_predicates is not None:
        for k,v in other_predicates.items():
            all_predicates[k] = v
    
    save_predicates(all_predicates, predicates_path)
    spec = plot_predicates(predicates, target, num_bins, hover_id)

    new_display = {i+predicate_id: PredicateDisplay(i+predicate_id, colors[i+predicate_id], new_predicates[i].feature_values, dtypes).display() for i in range(len(new_predicates))}
    feature_values = {i+predicate_id: new_predicates[i].feature_values for i in range(len(new_predicates))}
    feature_domains = {k: get_feature_domains(v.keys(), data, dtypes) for k,v in feature_values.items()}
    for k, v in feature_domains.items():
        for ki, vi in v.items():
            if dtypes[ki] == 'date':
                feature_domains[k][ki] = [str(vi[0]).split(' ')[0], str(vi[1]).split(' ')[0]]
    print(spec)
    return {'plot': spec, 'display': new_display, 'feature_values': feature_values, 'feature_domains': feature_domains, 'dtypes': dtypes}


def plot_predicate(predicate, x_feature, target_features, hover_id=None):
    filter = predicate.feature_mask[[col for col in predicate.feature_mask.columns if col != x_feature]].all(axis=1)
    dtypes = load_dtypes(dtypes_path)
    data = load_data(data_path, dtypes)
    d = pd.melt(data.loc[filter], x_feature, target_features)
    print(d)
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