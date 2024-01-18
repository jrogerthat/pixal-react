import React, { useReducer, createContext } from "react";
import formatPredicateArray from "./dataFormating";

export const DataContext = createContext();

const dTypes = {'Order-Date': 'date', 'Ship-Mode': 'nominal', 'Segment': 'nominal', 'State': 'nominal', 'Sub-Category': 'nominal', 'Quantity': 'numeric', 'Unit-Price': 'numeric', 'Unit-Cost': 'numeric', 'precipitation': 'numeric', 'temperature': 'numeric'}

const categoryDict = {
  'State': ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  'Segment': ['Consumer', 'Home Office','Corporate'],
  'Sub-Category': ['Machine', 'Bookcases', 'Chairs', 'Tables', 'Storage', 'Appliances', 'Copiers']
}

const numericalDict = {
  precipitation : [0, 20],
  temperature: [-32, 80]
}

const initialState = {
  predicateArray: [],
  selectedPredicate:null,
  highlightedPred:null,
  editMode: true,
  plotMode: 'overlap',
  categoricalFeatures: ["Sub-Category", "Segment", "State"],
  categoryDict: categoryDict,
  numericalDict: numericalDict,
  dataTypes: dTypes,
  hiddenPredicates: [],
  deletedPredicates: [],
  bookmarkedPlots: [],
  xCoord: null,
  yCoord: "score",
  negatedArray : [],
  scaleExtent: true,
  parentToChildDict: {},
};

const reducer = (state, action) => {

  switch (action.type) {

    case "ADD_BOOKMARK_PLOT":
      let newBooks = [...state.bookmarkedPlots, action.bookmarked]
      return {...state, bookmarkedPlots: newBooks}

    case "UPDATE_NEGATED":
        return {...state, negatedArray: action.negated}

    case "UPDATE_EDIT_MODE":
      
      return {...state, editMode: action.editMode, plotMode:'overlap', selectedPredicate: null, xCoord: null, yCoord: "Score"}

    case "UPDATE_PLOT_MODE":
     
      return {...state, plotMode: action.plotMode}

    case "UPDATE_PARENT_CHILD_ARRAY":
      return {...DataContext, parentToChildDict: action.pcArray}

    case "SET_PREDICATE_EXPLORE_DATA":
      let arr = formatPredicateArray(action.predData);
      let pToC = action.parentToChildDict !== null ? action.parentToChildDict : state.parentToChildDict;
      return {...state, predicateArray: arr, parentToChildDict: pToC}

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