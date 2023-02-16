import { useMemo, useState } from 'react'

import '../App.css';
import Button from '@mui/material/Button';
import { useAxiosGet } from '../axiosUtil';
import AddPredBox from './addPredicateBox';
import EditablePredicate from './editablePredComp';

function PredicateNav({predEditMode, setPredEditMode}) {

  const { data, error, loaded } = useAxiosGet('/load_predicates');
  const predicates = useMemo(() => {
    return data || [];
  }, [data]);

  const [addPredMode, setAddPredMode] = useState(false);

  return (
    <div className="pred-exp-nav">
      <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button>
      {
        addPredMode && <AddPredBox setPredEditMode={setAddPredMode} />
      }
      <div>
        {
          predicates.map(p => (
           <EditablePredicate key={`pred-edir-${p[0]}`} predicateData={p}/>
          ))
        }
      </div>
    </div>
  );
}

export default PredicateNav;