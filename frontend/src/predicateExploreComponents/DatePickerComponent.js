import React, { useContext, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';

export const BasicDatePickerComp = ({predData, label, dateRange}) => {

  const [{}, dispatch] = useContext(DataContext);

  const [startDate, setStartDate] = useState(new Date(dateRange[0]));
  const [endDate, setEndDate] = useState(new Date(dateRange[1]))
  const [predAtt, setPredAtt] = useState(predData.predicate.attribute_values);


const useCalendarClose = () => {

  let formatedStart = `${startDate.getUTCFullYear()}-${startDate.getMonth() + 1}-${startDate.getUTCDate()}`;
  let formatedEnd = `${endDate.getUTCFullYear()}-${endDate.getMonth() + 1}-${endDate.getUTCDate()}`;

  let newPred = {...predAtt};
  newPred[label] = [formatedStart, formatedEnd];
  setPredAtt(newPred)

  let pass = {features: newPred, id: predData.id}
  useGetAxiosAsync(`edit_predicate_clause?${JSON.stringify(pass)}`).then(data => {
      dispatch({type: "SET_PREDICATE_EXPLORE_DATA", predData: data.data, parentToChildArray: null})
  })
}
  
  return (
    <div>
    <div style={{fontWeight:800, color:'gray', marginLeft:22, marginBottom:5}}>{label}</div>
    <div style={{display:'flex', flexDirection:'row', marginLeft:10, marginBottom:10}}>
      <div style={{marginLeft:12, marginRight:5}}>From</div>
      <DatePicker  
        selected={startDate}
        onChange={(date)=> setStartDate(date)}
        onCalendarClose={useCalendarClose}/>
      <div style={{marginRight:5}}>To</div>
      <DatePicker 
      selected={endDate}
        onChange={(date)=> setEndDate(date)}
        onCalendarClose={useCalendarClose}
      />
    </div>
    </div>
  );
};