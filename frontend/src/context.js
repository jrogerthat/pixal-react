import axios from "axios";
import React, { useReducer, createContext } from "react";
import { useAxiosGet, useGetAxiosAsync } from "./axiosUtil";

export const DataContext = createContext();

const initialState = {
  predicateArray: [],
  predicateDistributionArray: [],
  selectedPredicate:null
};

const reducer = (state, action) => {

  switch (action.type) {
    case "SET_PREDICATE_EXPLORE_DATA":
        return {...state, predicateArray: action.predData.pred_list, predicateDistributionArray: action.predData.pred_dist}

    case "ADD_PREDICATE":
        console.log('NEED TO FILL THIS OUT')
      return {
        ...state
      };
      
    case "UPDATE_SELECTED_PREDICATE":
        return {...state, selectedPredicate : action.predSel};
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