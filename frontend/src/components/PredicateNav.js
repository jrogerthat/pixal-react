import { useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from './addPredicateBox';
import PredicateComp from './predicateComponent';

function PredicateNav({predicateArray, setPredicateArray, setHighlightPred, predEditMode}) {

  const [addPredMode, setAddPredMode] = useState(false);


  return (
    <div className="pred-exp-nav">
      {
        predEditMode ? <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button> : <span>Predicates</span>
      }
      
      {
        addPredMode && <AddPredBox setAddPredMode={setAddPredMode} setPredicateArray={setPredicateArray}  />
      }
      <div>
        {
          predicateArray.map(p => (
           <PredicateComp
           key={`pred-edir-${p[0]}`} 
           predicateData={p} 
           setHighlightPred={setHighlightPred}
           predEditMode={predEditMode}
           />
          ))
        }
      </div>
    </div>
  );
}

export default PredicateNav;