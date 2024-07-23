import React, { useReducer, createContext } from "react";
import formatPredicateArray from "./dataFormating";

export const DataContext = createContext();

// const dTypes = {'Order-Date': 'date', 'Ship-Mode': 'nominal', 'Segment': 'nominal', 'State': 'nominal', 'Sub-Category': 'nominal', 'Quantity': 'numeric', 'Unit-Price': 'numeric', 'Unit-Cost': 'numeric', 'precipitation': 'numeric', 'temperature': 'numeric'}

const dTypes = {'diagnosis': 'nominal', 'insurance': 'nominal', 'modifier': 'nominal', 'procedure': 'nominal', 'duration': 'numeric', 'pdenial': 'numeric', 'denied': 'numeric'}

const initialState = {
  predicateArray: [],
  selectedPredicate:null,
  highlightedPred:null,
  editMode: true,
  plotMode: 'multiples',
  plotStyle:'histogram',
  categoricalFeatures: null,
  dataTypes: dTypes,
  dataTypeRanges: null,
  hiddenPredicates: [],
  deletedPredicates: [],
  bookmarkedPlots: [],
  xCoord: null,
  yCoord: "score",
  negatedArray : [],
  scaleExtent: true,
  parentToChildDict: {},
  attribute_filtered: []
};

const reducer = (state, action) => {

  console.log('reducer')
  console.log(action)
  switch (action.type) {

    case "UPDATE_ATTRIBUTE_FILTERS":
      let temp = state.attribute_filtered;
      if(action.hideBool){
        temp = [...temp, ...action.ids]
      }else{
        temp = temp.filter(f => !action.ids.includes(f))
      }
      return {...state, attribute_filtered: Array.from(new Set(temp))}
    case "ADD_BOOKMARK_PLOT":
      let newBooks = [...state.bookmarkedPlots, action.bookmarked]
      return {...state, bookmarkedPlots: newBooks}

    case "UPDATE_NEGATED":
        return {...state, negatedArray: action.negated}

    case "UPDATE_EDIT_MODE":
      return {...state, editMode: action.editMode, plotMode:'overlap', selectedPredicate: null, xCoord: null, yCoord: "Score"}

    case "UNSELECT_PREDICATE":
      return {...state, selectedPredicate: null, xCoord: null, yCoord: "Score"}
  
    case "UPDATE_PLOT_MODE":
      return {...state, plotMode: action.plotMode}

    case "UPDATE_PLOT_STYLE":
      return {...state, plotStyle: action.plotStyle}

    case "UPDATE_PARENT_CHILD_ARRAY":
      return {...DataContext, parentToChildDict: action.pcArray}

    case "SET_PREDICATE_EXPLORE_DATA":
      let arr = formatPredicateArray(action.predData);
      let pToC = action.parentToChildDict !== null ? action.parentToChildDict : state.parentToChildDict;
      let catFeat = Object.entries(action.dataTypes).filter(f=> f[1] === 'nominal').map(m => m[0])
      
      return {...state, 
        predicateArray: arr, 
        parentToChildDict: pToC, 
        dataTypes: action.dataTypes !== null ? action.dataTypes : state.dataTypes, 
        categoricalFeatures:catFeat, 
        dataTypeRanges: action.dataTypeRanges !== null ? action.dataTypeRanges : state.dataTypeRanges}

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

    case "CHANGE_SCALE":
      return {...state, scaleExtent: action.scaleExtent}

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