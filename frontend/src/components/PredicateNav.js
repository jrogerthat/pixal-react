import React, { useContext, useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from '../predicateExploreComponents/addPredicateBox';
import PredicateComp from './predicateComponent';
import { DataContext } from '../context';
import * as d3 from 'd3';

const NestedWrapper = ({predicateData, setHighlightPred, scoreExtent}) => {
  console.log(predicateData);
  let predArray = predicateData.children ? [...predicateData.children, predicateData] : [predicateData];

  return(
    <div>{
      predArray.map((p, i) => (
      <PredicateComp
        key={`pred-edir-${p.id}`} 
        predicateData={p} 
        setHighlightPred={setHighlightPred}
        scoreExtent={scoreExtent}
        />
  ))}</div>
  )
}

export default function PredicateNav({setHighlightPred}) {

  const [addPredMode, setAddPredMode] = useState(false);
  const [{editMode, predicateArray, hiddenPredicates, deletedPredicates, parentToChildDict}, dispatch] = useContext(DataContext);

  const filteredPredicates = useMemo(() => {  
    const test = predicateArray.filter(f => deletedPredicates.indexOf(f.id) === -1).sort((a, b) => b.predicate.score - a.predicate.score)
    const parents = test.filter(f => Object.keys(parentToChildDict).includes(f.id));
    let child = []
    if(parents.length === 0){
      return test;
    }else{
      let starter = parents.map(p => {
        let children = test.filter(f => parentToChildDict[p.id].includes(+f.id));
        child = [...child, ...children.map(m => +m.id)]
        p.children = children.map(c => {
          c.parent = p.id;
          return c
        });
        return p
      });

      let notKid = test.filter(t => child.indexOf(+t.id) === -1 && Object.keys(parentToChildDict).indexOf(t.id) === -1);
      let combo = [...starter, ...notKid];
      return combo;
    }
  }, [predicateArray, parentToChildDict]);

  console.log('FILTERED PRED', filteredPredicates);
  let scoreExtent = d3.extent(filteredPredicates.map(m => m.predicate.score));

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
          //  <PredicateComp
          //  key={`pred-edir-${p.id}`} 
          //  predicateData={p} 
          //  setHighlightPred={setHighlightPred}
          //  scoreExtent={scoreExtent}
          //  />
          <NestedWrapper 
            key={`pred-edir-${p.id}`} 
            predicateData={p} 
            setHighlightPred={setHighlightPred}
            scoreExtent={scoreExtent}
          />
          )) : filteredPredicates.filter(f => hiddenPredicates.indexOf(f.id) === -1).map(p => (
            // <PredicateComp
            // key={`pred-edir-${p.id}`} 
            // predicateData={p} 
            // setHighlightPred={setHighlightPred}
            // scoreExtent={scoreExtent}
            // />
            <NestedWrapper 
            key={`pred-edir-${p.id}`} 
            predicateData={p} 
            setHighlightPred={setHighlightPred}
            scoreExtent={scoreExtent}
          />
            ))
        }
      </div>
    </div>
  );
}