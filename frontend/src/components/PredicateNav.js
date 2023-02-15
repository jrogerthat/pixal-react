import { useMemo } from 'react'

import '../App.css';
import Button from '@mui/material/Button';
import { useAxiosGet } from '../axiosUtil';

function PredicateNav({predEditMode, setPredEditMode}) {

  
  const { data, error, loaded } = useAxiosGet('/load_predicates');
  const predicates = useMemo(() => {
    return data || [];
    // return JSON.stringify(data || {});
  }, [data]);

  console.log('DATA', predicates);


  return (
    <div className="pred-exp-nav">
      <Button
      variant="outlined"
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
        {
          predicates.map(p => (
            <div key={`pred-${p[0]}`}></div>
          ))
        }
      </div>
    </div>
  );
}

export default PredicateNav;