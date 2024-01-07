import React, { useContext, useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from '../predicateExploreComponents/addPredicateBox';
import PredicateComp from './predicateComponent';
import { DataContext } from '../context';
import * as d3 from 'd3';

export default function PredicateNav({setHighlightPred}) {

  const [addPredMode, setAddPredMode] = useState(false);
  const [{editMode, predicateArray, hiddenPredicates, deletedPredicates}, dispatch] = useContext(DataContext);

  const filteredPredicates = useMemo(() => {
    return predicateArray.filter(f => deletedPredicates.indexOf(f.id) === -1).sort((a, b) => a.predicate.score - b.predicate.score).reverse();
  }, [predicateArray]);

  let scoreExtent = d3.extent(filteredPredicates.map(m => m.predicate.score))

  return (
    <div className="pred-exp-nav">
      {
        editMode ? <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button> : <span className='head-3'>Predicates</span>
      }
      {
        editMode && <Button variant="outlined" onClick={()=> {
          dispatch({type: "UPDATE_HIDDEN_PREDS", hidden: predicateArray.map(m => m.id)})
        }}>Hide All Predicates</Button>
      }
      
      {
        addPredMode && <AddPredBox setAddPredMode={setAddPredMode}  />
      }
      <div>
        {
          editMode ? filteredPredicates.map(p => (
           <PredicateComp
           key={`pred-edir-${p.id}`} 
           predicateData={p} 
           setHighlightPred={setHighlightPred}
           scoreExtent={scoreExtent}
           />
          )) : filteredPredicates.filter(f => hiddenPredicates.indexOf(f.id) === -1).map(p => (
            <PredicateComp
            key={`pred-edir-${p.id}`} 
            predicateData={p} 
            setHighlightPred={setHighlightPred}
            scoreExtent={scoreExtent}
            />))
        }
      </div>
    </div>
  );
}