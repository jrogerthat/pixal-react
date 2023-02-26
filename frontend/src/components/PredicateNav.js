import { useContext, useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from './addPredicateBox';
import PredicateComp from './predicateComponent';
import { DataContext } from '../context';

function PredicateNav({setHighlightPred, hiddenPreds, setHiddenPreds}) {

  const [addPredMode, setAddPredMode] = useState(false);
  const [{editMode, predicateArray}, dispatch] = useContext(DataContext);

 
 
  return (
    <div className="pred-exp-nav">
      {
        editMode ? <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button> : <span>Predicates</span>
      }
      
      {
        addPredMode && <AddPredBox setAddPredMode={setAddPredMode}  />
      }
      <div>
        {
          predicateArray.map(p => (
           <PredicateComp
           key={`pred-edir-${p.id}`} 
           predicateData={p} 
           setHighlightPred={setHighlightPred}
           hiddenPreds={hiddenPreds}
           setHiddenPreds={setHiddenPreds}
           />
          ))
        }
      </div>
    </div>
  );
}

export default PredicateNav;