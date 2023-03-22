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
  bookmarkedPlots: [],
  xCoord: null,
  yCoord: "score"
};

const reducer = (state, action) => {

  switch (action.type) {

    case "ADD_BOOKMARK_PLOT":
      let newBooks = [...state.bookmarkedPlots, action.bookmarked]
      return {...state, bookmarkedPlots: newBooks}

    case "UPDATE_EDIT_MODE":
      return {...state, editMode: action.editMode, selectedPredicate: null, xCoord: null, yCoord: "Score"}

    case "SET_PREDICATE_EXPLORE_DATA":
      let arr = formatPredicateArray(action.predData.pred_list);
      return {...state, predicateArray: arr, predicateDistributionArray: action.predData.pred_dist}

    case "UPDATE_PREDICATE_ARRAY":
        let pArr = formatPredicateArray(action.predData.pred_list);
        console.log(pArr, action.predData.pred_dist)
        return {...state, predicateArray: pArr, predicateDistributionArray: action.predData.pred_dist}

    case "UPDATE_SELECTED_PREDICATE":
        return {...state, selectedPredicate: action.predSel, xCoord: null, yCoord: "Score"};

    case "UPDATE_SELECTED_PRED_X_Y":
      return {...state, selectedPredicate: action.predSel, xCoord:action.x, yCoord:action.y }
      // predSel: b.selectedPredicate, x: b.x, y: b.y
    case "UPDATE_AXIS":
      return {...state, xCoord: action.coords.x, yCoord: action.coords.y}

    case "UPDATE_PRED_AND_AXIS":
      return {...state, xCoord: action.coords.x, yCoord: action.coords.y, selectedPredicate: action.coords.selectedPredicate}

    case "FEATURE_SELECTED":
      let newSelectedPred = {...state.selectedPredicate}
      newSelectedPred.feature = action.feature;
      return {...state, selectedPredicate : newSelectedPred, xCoord: action.feature[0]}

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