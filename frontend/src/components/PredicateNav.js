import React, { useContext, useMemo, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import AddPredBox from '../predicateExploreComponents/addPredicateBox';
import PredicateComp from './predicateComponent';
import { DataContext } from '../context';
import * as d3 from 'd3';
import { PredExplorePlot } from './plots/predExplorerPlot';

function createNestedStructure(objects, parentChildMap) {
  // Step 1: Create a lookup map
  const lookup = objects.reduce((acc, obj) => {
      acc[obj.id] = {...obj, children: []}; // Step 2
      return acc;
  }, {});

  // Step 3: Populate children
  Object.entries(parentChildMap).forEach(([parentId, childIds]) => {
      childIds.forEach(childId => {
          // console.log('parent', parentId, childId)
          const parent = lookup[parentId];
          const child = lookup[childId];
          // console.log('look up', parent, child)
          if (parent && child) {
            // console.log('have parent and child', parent);
              if(parent.children){
                parent.children.push(child);
              }else{
                parent.children = []
                parent.children.push(child);
              }
          }
      });
  });

  // Step 4: Extract root objects
  const roots = objects.filter(obj => {
      return Object.entries(parentChildMap).flatMap(m => +m[1]).indexOf(+obj.id) === -1
  }).map(obj => lookup[obj.id]);

  return roots;
}

function unnestRender(predicateData){

  let keeper = []
  predicateData.level = 0;
  keeper.push(predicateData)
  recurseReverse(predicateData.children, keeper, 1)
  return keeper;
}

function recurseReverse(nodes, array, lev){
  
  if(nodes && nodes.length > 0){
    
    nodes.map(n => {
      n.level = lev
      array.push(n)
      recurseReverse(n.children, array, lev + 1)
    })
  }

}

export const NestedWrapper = ({predicateData, scoreExtent}) => {
  
  let predArray = unnestRender(predicateData);
  // predicateData.children ? [predicateData, ...predicateData.children] : [predicateData];
  // let tester = unnestRender(predicateData);
  // console.log('TEST', tester);
  const [{plotMode}, dispatch] = useContext(DataContext);
  console.log('pred', predicateData.id, predicateData)
  return(
    <div>{
      predArray.map((p, i) => (
       <div 
       key={`pred-edir-${p.id}`}
       style={{display:'flex'}}>
        {/* <div style={{background:'red', display:'inline'}}> */}
        {p.level > 0 && <div style={{flex: '0 0 20px', marginLeft: (p.level * 20)}}>
          <svg style={{width:20, height:'100%', filter:'drop-shadow(1px 1px 2px rgb(0 0 0 / 0.1))'}}>
            <line x1={10} x2={20} y1={60} y2={60} stroke={'#FFF'} strokeWidth={8}/>
            <line x1={10} x2={10} y1={-20} y2={64} stroke={'#FFF'} strokeWidth={8}/>
          </svg></div> }
        <PredicateComp
          // key={`pred-edir-${p.id}`} 
          predicateData={p} 
          // setHighlightPred={setHighlightPred}
          index={i}
          scoreExtent={scoreExtent}
          />
          {
            plotMode === 'multiples' && (
              <div
              className="pred-wrap"
              style={{
                marginLeft:10,
                width:700, 
                height:250,
                backgroundColor:'white',
                borderRadius: 4,
                marginTop: 5,
                padding:5,
                paddingLeft:20,
                boxShadow: `0px 3px 15px rgba(0,0,0,0.1)`,
              }}
              ><PredExplorePlot width={600} height={200} singlePred={p} />
              </div>
              
            )
          }
        </div>
       
        // </div>
  ))}</div>
  )
}

export default function PredicateNav() {

  const [addPredMode, setAddPredMode] = useState(false);
  const [{selectedPredicate, predicateArray, hiddenPredicates, deletedPredicates, parentToChildDict}, dispatch] = useContext(DataContext);

  const filteredPredicates = useMemo(() => {  
    const unsorted = createNestedStructure(predicateArray, parentToChildDict);
    const not_deleted = []
    unsorted.forEach((f, i) => {
      if(deletedPredicates.indexOf(f.id) === -1){
        not_deleted.push(f)
      }else{
        not_deleted.push(...f.children)
      }
    })

    return not_deleted.sort((a, b) => b.predicate.score - a.predicate.score);

  }, [predicateArray, parentToChildDict]);

  let scoreExtent = d3.extent(filteredPredicates.map(m => m.predicate.score));
  // let predNavData = editMode ? filteredPredicates : filteredPredicates.filter(f => hiddenPredicates.indexOf(f.id) === -1);
  let predNavData = filteredPredicates.filter(f => hiddenPredicates.indexOf(f.id) === -1);

  return (
    <div className="pred-exp-nav" style={{overflowX:'hidden'}}>
      {
        !selectedPredicate ? <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button> : <span className='head-3'>Predicates</span>
      }
      {
        !selectedPredicate && <Button variant="outlined" onClick={()=> {
          dispatch({type: "UPDATE_HIDDEN_PREDS", hidden: predicateArray.map(m => m.id)})
        }}>Hide All Predicates</Button>
      }
      {
        addPredMode && <AddPredBox setAddPredMode={setAddPredMode}  />
      }
      <div>
        {
          predNavData.map(p => (
          <NestedWrapper 
            key={`pred-edir-${p.id}`} 
            predicateData={p} 
            // setHighlightPred={setHighlightPred}
            scoreExtent={scoreExtent}
          />
          ))
        }
      </div>
    </div>
  );
}