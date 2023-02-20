import { useContext, useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from './addPredicateBox';
import PredicateComp from './predicateComponent';
import { DataContext } from '../context';

function PredicateNav({predicateArray, setPredicateArray, setHighlightPred, predEditMode, hiddenPreds, setHiddenPreds}) {

  const [addPredMode, setAddPredMode] = useState(false);

//  const [{contacts}, dispatch] = useContext(DataContext)

//  console.log('CONTACTS', contacts)
 
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
           key={`pred-edir-${p.id}`} 
           predicateData={p} 
           setHighlightPred={setHighlightPred}
           predEditMode={predEditMode}
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