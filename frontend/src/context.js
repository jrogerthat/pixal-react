import React, { useReducer, createContext } from "react";
import formatPredicateArray from "./dataFormating";

export const DataContext = createContext();

// const dTypes = {'Order-Date': 'date', 'Ship-Mode': 'nominal', 'Segment': 'nominal', 'State': 'nominal', 'Sub-Category': 'nominal', 'Quantity': 'numeric', 'Unit-Price': 'numeric', 'Unit-Cost': 'numeric', 'precipitation': 'numeric', 'temperature': 'numeric'}

const dTypes = {'diagnosis': 'nominal', 'insurance': 'nominal', 'modifier': 'nominal', 'procedure': 'nominal', 'duration': 'numeric', 'pdenial': 'numeric', 'denied': 'numeric'}

const categoryDict = {
  // 'State': ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  // 'Segment': ['Consumer', 'Home Office','Corporate'],
  // 'Sub-Category': ['Machine', 'Bookcases', 'Chairs', 'Tables', 'Storage', 'Appliances', 'Copiers'],
  // "denied": [0,1],
  "diagnosis": ["E2XXX", "A6XXX", "H7XXX", "G1XXX", "A5XXX","C6XXX","A3XXX","E9XXX","J6XXX","I4XXX","B6XXX","E1XXX","C5XXX","J4XXX","F6XXX","I9XXX","G4XXX",
    "C7XXX",
    "C9XXX",
    "F3XXX",
    "E5XXX",
    "D5XXX",
    "C8XXX",
    "I2XXX",
    "G2XXX",
    "C3XXX",
    "J8XXX",
    "B1XXX",
    "J2XXX",
    "B5XXX",
    "B2XXX",
    "I7XXX",
    "G7XXX",
    "E3XXX",
    "E8XXX",
    "G3XXX",
    "D7XXX",
    "G9XXX",
    "I5XXX",
    "H3XXX",
    "J1XXX",
    "E7XXX",
    "F4XXX",
    "D8XXX",
    "A1XXX",
    "J7XXX",
    "H8XXX",
    "G8XXX",
    "F8XXX",
    "A4XXX",
    "F2XXX",
    "C4XXX",
    "I6XXX",
    "B3XXX",
    "D3XXX",
    "B8XXX",
    "A8XXX",
    "H6XXX",
    "D6XXX",
    "A2XXX",
    "C2XXX",
    "D4XXX",
    "D9XXX",
    "B7XXX",
    "A9XXX",
    "G5XXX",
    "D1XXX",
    "G6XXX",
    "D2XXX",
    "J3XXX",
    "H9XXX",
    "C1XXX",
    "E4XXX",
    "H5XXX",
    "J9XXX",
    "I3XXX",
    "E6XXX",
    "H4XXX","J5XXX","H1XXX","B9XXX","A7XXX","I8XXX","F1XXX","F5XXX","B4XXX","F9XXX","F7XXX","H2XXX","I1XXX"
  ],
  "insurance": [
    "Payer I", "Payer J", "Payer G", "Payer F", "Payer B", "Payer C", "Payer D", "Payer H", "Payer E", "Payer A"
  ],
  "modifier": ["9X","2X","4X","8X","5X","3X","1X","6X","7X"], 
  "procedure": [
    "14XXX",
    "99XXX",
    "65XXX",
    "74XXX",
    "87XXX",
    "84XXX",
    "28XXX",
    "44XXX",
    "53XXX",
    "33XXX",
    "79XXX",
    "51XXX",
    "55XXX",
    "16XXX",
    "37XXX",
    "43XXX",
    "30XXX",
    "58XXX",
    "20XXX",
    "46XXX",
    "61XXX",
    "98XXX",
    "27XXX",
    "67XXX",
    "36XXX",
    "88XXX",
    "62XXX",
    "35XXX",
    "42XXX",
    "49XXX",
    "18XXX",
    "92XXX",
    "82XXX",
    "76XXX",
    "24XXX",
    "39XXX",
    "71XXX",
    "15XXX",
    "40XXX",
    "77XXX",
    "32XXX",
    "83XXX",
    "26XXX",
    "90XXX",
    "48XXX",
    "78XXX",
    "52XXX",
    "57XXX",
    "86XXX",
    "64XXX",
    "59XXX",
    "45XXX",
    "73XXX",
    "94XXX",
    "89XXX",
    "56XXX",
    "47XXX",
    "38XXX",
    "29XXX",
    "95XXX",
    "97XXX",
    "25XXX",
    "12XXX",
    "13XXX",
    "21XXX",
    "22XXX",
    "31XXX",
    "11XXX",
    "19XXX",
    "72XXX",
    "60XXX",
    "69XXX",
    "34XXX",
    "70XXX",
    "93XXX","10XXX","96XXX","63XXX","91XXX","66XXX","54XXX","68XXX","80XXX","41XXX","23XXX","50XXX","81XXX","17XXX","85XXX","75XXX"
  ]
}

const numericalDict = {
  'duration' : [1.877715e-10, 1.441287e+02],
  'pdenial': [6.447861e-19, 9.995778e-01],
  'denied': [0, 1]
}

// const initialState = {
//   predicateArray: [],
//   selectedPredicate:null,
//   highlightedPred:null,
//   editMode: true,
//   plotMode: 'multiples',
//   plotStyle:'histogram',
//   // categoricalFeatures: ["Sub-Category", "Segment", "State"],
//   categoryDict: categoryDict,
//   // null,//valueDict,//categoryDict,
//   numericalDict: numericalDict,
//   // valueDict: null,
//   dataTypes: null,//dTypes,
//   hiddenPredicates: [],
//   deletedPredicates: [],
//   bookmarkedPlots: [],
//   xCoord: null,
//   yCoord: "score",
//   negatedArray : [],
//   scaleExtent: true,
//   parentToChildDict: {},
//   attribute_filtered: []
// };

const initialState = {
  predicateArray: [],
  selectedPredicate:null,
  highlightedPred:null,
  editMode: true,
  plotMode: 'multiples',
  plotStyle:'histogram',
  categoricalFeatures: ["procedure", "diagnosis", "insurance", "modifier"],
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
      
      return {...state, predicateArray: arr, parentToChildDict: pToC, dataTypes: action.dataTypes}

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