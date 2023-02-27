import { useContext, useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from './addPredicateBox';
import PredicateComp from './predicateComponent';
import { DataContext } from '../context';

function PredicateNav({setHighlightPred}) {

  const [addPredMode, setAddPredMode] = useState(false);
  const [{editMode, predicateArray, hiddenPredicates}, dispatch] = useContext(DataContext);

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
          editMode ? predicateArray.map(p => (
           <PredicateComp
           key={`pred-edir-${p.id}`} 
           predicateData={p} 
           setHighlightPred={setHighlightPred}
           />
          )) : predicateArray.filter(f => hiddenPredicates.indexOf(f.id) === -1).map(p => (
            <PredicateComp
            key={`pred-edir-${p.id}`} 
            predicateData={p} 
            setHighlightPred={setHighlightPred}
            />))
        }
      </div>
    </div>
  );
}

export default PredicateNav;