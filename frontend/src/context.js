import axios from "axios";
import React, { useReducer, createContext } from "react";
import { useAxiosGet, useGetAxiosAsync } from "./axiosUtil";

export const DataContext = createContext();

const initialState = {
  predicateArrayTest: [],
  predicateDistributionArray: [],
  selectedPredicate:null
};

const reducer = (state, action) => {

  switch (action.type) {
    case "SET_PREDICATE_EXPLORE_DATA":
        
        return {...state, predicateArrayTest: action.fit}

    case "SET_DATA":
        console.log('set data called')
      return {...state};
    case "START":
      return {
        loading: true
      };
    case "COMPLETE":
      return {
        loading: false
      };
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