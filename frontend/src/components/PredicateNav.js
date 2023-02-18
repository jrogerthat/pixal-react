import { useMemo, useState } from 'react'

import '../App.css';
import Button from '@mui/material/Button';
import { useAxiosGet } from '../axiosUtil';
import AddPredBox from './addPredicateBox';
import EditablePredicate from './editablePredComp';

function PredicateNav({predicateArray, setHighlightPred}) {

  const [addPredMode, setAddPredMode] = useState(false);

  const handleHighlight = (p) => {
    setHighlightPred(p)
    console.log('NEW COLOR', p);
  }

  return (
    <div className="pred-exp-nav">
      <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button>
      {
        addPredMode && <AddPredBox setAddPredMode={setAddPredMode} />
      }
      <div>
        {
          Object.entries(predicateArray).map(p => (
           <EditablePredicate 
           key={`pred-edir-${p[0]}`} 
           predicateData={p} 
           setHighlightPred={setHighlightPred}
          //  onMouseEnter={() => handleHighlight(p[0])}
          //  onMouseLeave={() => handleHighlight(null)}
           />
          ))
        }
      </div>
    </div>
  );
}

export default PredicateNav;