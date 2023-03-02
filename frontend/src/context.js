import React, { useReducer, createContext } from "react";
import formatPredicateArray from "./dataFormating";

export const DataContext = createContext();

const initialState = {
  predicateArray: [],
  predicateDistributionArray: [],
  selectedPredicate:null,
  highlightedPred:null,
  editMode: true,
  categoricalFeatures: ["Sub-Category", "Segment", "State"],
  hiddenPredicates: [],
  deletedPredicates: [],
  bookmarkedPlots: []
};

const reducer = (state, action) => {

  switch (action.type) {
    case "UPDATE_EDIT_MODE":
      return {...state, editMode: action.editMode}

    case "SET_PREDICATE_EXPLORE_DATA":
       
        let arr = formatPredicateArray(action.predData.pred_list);

        return {...state, predicateArray: arr, predicateDistributionArray: action.predData.pred_dist}

    case "UPDATE_PREDICATE_ARRAY":
        let pArr = formatPredicateArray(action.predicateArray);
       
        return {...state, predicateArray: pArr}


    case "UPDATE_SELECTED_PREDICATE":
        return {...state, selectedPredicate : action.predSel};

    case "FEATURE_SELECTED":
      let newSelectedPred = {...state.selectedPredicate}
      newSelectedPred.feature = action.feature;
      return {...state, selectedPredicate : newSelectedPred}

    case "PREDICATE_HOVER":
      return {...state, highlightedPred: action.pred}

    case "UPDATE_HIDDEN_PREDS":
      return {...state, hiddenPredicates: action.hidden}

    case "DELETE_PREDICATE":
      return {...state, deletedPredicates: action.deleted}

    default:
      throw new Error();
  }
};

export const DataContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={[state, dispatch]}>
      {props.children}
    </DataContext.Provider>
  );
};