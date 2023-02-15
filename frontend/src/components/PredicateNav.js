import { useState, useEffect, useMemo } from 'react'
import axios from "axios";
import '../App.css';
import Button from '@mui/material/Button';
import { useAxiosGet } from '../axiosUtil';

function PredicateNav({predEditMode, setPredEditMode}) {

  

  const { data, error, loaded } = useAxiosGet('/load_predicates');
  const stringifiedData = useMemo(() => {
    return JSON.stringify(data || {});
  }, [data]);

  console.log('DATA', stringifiedData);


  return (
    <div className="pred-exp-nav">
      <Button
      onClick={()=> predEditMode ? setPredEditMode(false) : setPredEditMode(true)}
      >{predEditMode ? "Explore Predicate Explanations" : "Explore Predicate Explorer"}</Button>
      <div>
        {/* {
          data.length > 0 ? 
            data.map((d) => {
              <div key={'pred-'+d[0]} className="pred-wrap">pred</div>
            }) :
            <div>loading...</div>
        } */}
      </div>
    </div>
  );
}

export default PredicateNav;