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
       
          const parent = lookup[parentId];
          const child = lookup[childId];
         
          if (parent && child) {
          
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
 
  const [{plotMode, selectedPredicate}, dispatch] = useContext(DataContext);

  let isSelected = () => {
    return (selectedPredicate && predicateData.id === selectedPredicate.predicate_id) ? predicateData.color : 'white';//'#e8e4e4e0';
}

  
  return(
    <div>{
      predArray.map((p, i) => (
       <div 
       key={`pred-edir-${p.id}`}
       style={{display:'flex'}}>
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
                marginLeft:3,
                width: selectedPredicate ? 370 : 700, 
                height:245,
                backgroundColor:'white',
                borderRadius: 4,
                marginTop: 5,
                padding:5,
                paddingLeft:20,
                boxShadow: `0px 3px 15px rgba(0,0,0,0.1)`,
                border: `3px solid ${isSelected()}`,
              }}
              ><PredExplorePlot width={selectedPredicate ? 280 : 600} height={200} singlePred={p} />
              </div>
            )
          }
        </div>
  ))}</div>
  )
}

function Checkbox({data}) {
  const [, dispatch] = useContext(DataContext);
  const [checked, setChecked] = useState(true);

  return (
    <label>
      <input type="checkbox"
        defaultChecked={checked}
        onChange={() => {
          setChecked((state) => !state)
    
          dispatch({type: "UPDATE_ATTRIBUTE_FILTERS", ids: data[1], hideBool: checked})
        }}
      />
      {`${data[0]} (${data[1].length})`}
    </label>
  );
}

export default function PredicateNav() {

  const [addPredMode, setAddPredMode] = useState(false);
  const [{attribute_filtered, selectedPredicate, predicateArray, hiddenPredicates, deletedPredicates, parentToChildDict}, dispatch] = useContext(DataContext);

  let test = predicateArray.map(p => p.predicate.attribute_values);
  let keys = Array.from(new Set(test.flatMap(f => Object.keys(f))));
  let obs = keys.map((k, i)=> {
    let keeper = []
    predicateArray.map(m => {
      if(m.predicate.attribute_values[k]){
        keeper.push(m)
      }
    });

    let test = Array.from(new Set(keeper.flatMap(m => m.predicate.attribute_values[k]))).map(t => {
      let working = keeper.filter(f => f.predicate.attribute_values[k].includes(t)).map(m => m.id)
  
      return [t, working]
    });

    return [k, test]
  });

  const filteredPredicates = useMemo(() => {  
    const unsorted = createNestedStructure(predicateArray, parentToChildDict);
    const not_deleted = []
    unsorted.forEach((f, i) => {
      if(deletedPredicates.indexOf(f.id) === -1 && attribute_filtered.map(m => +m).indexOf(+f.id) === -1){
        not_deleted.push(f)
      }else{
        not_deleted.push(...f.children)
      }
    })

    return not_deleted.sort((a, b) => b.predicate.score - a.predicate.score);

  }, [predicateArray, parentToChildDict, attribute_filtered]);

  let scoreExtent = d3.extent(filteredPredicates.map(m => m.predicate.score));
  // let predNavData = editMode ? filteredPredicates : filteredPredicates.filter(f => hiddenPredicates.indexOf(f.id) === -1);
  let predNavData = filteredPredicates.filter(f => hiddenPredicates.indexOf(f.id) === -1);
  const [showingFilter, setShowingFilter] = useState(false);

  return (
    <div className="pred-exp-nav" style={{overflowX:'hidden'}}>
      {
        !selectedPredicate ? <Button
        variant="outlined"
        onClick={() => addPredMode ? setAddPredMode(false) : setAddPredMode(true)}
      >{addPredMode ? "Cancel" : "Add Predicate"}</Button> : 
      <div style={{display: 'flex', justifyContent:'space-between', alignItems:'end'}}>
        <div style={{paddingBottom:5}}><span className='head-3'>{`Showing ${filteredPredicates.length} Predicates`}</span></div>
        <div
        style={{cursor: 'pointer', backgroundColor:'#FFF', padding:8, borderRadius:5, border: "1 solid gray"}}
        ><span
        className='head-3'
        // style={{cursor: 'pointer', backgroundColor:'#FFF', padding:5}}
        onClick={()=> showingFilter ? setShowingFilter(false) : setShowingFilter(true)}
        >{showingFilter ? "Hide Predicate Filters" : "Show Predicate Filters"}
        </span>
        <span style={{paddingTop:20}}>
        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          {
            showingFilter ? <path d="M5.16108 14.9083C4.45387 15.7165 5.02785 16.9814 6.1018 16.9814H17.898C18.972 16.9814 19.5459 15.7165 18.8388 14.9083L13.3169 8.59762C12.6197 7.80079 11.3801 7.80079 10.6829 8.59762L5.16108 14.9083ZM6.65274 15.4814L11.8118 9.58537C11.9114 9.47154 12.0885 9.47154 12.1881 9.58537L17.3471 15.4814H6.65274Z" fill="gray"/>
        : <path d="M5.16108 10.0731C4.45387 9.2649 5.02785 8 6.1018 8H17.898C18.972 8 19.5459 9.2649 18.8388 10.0731L13.3169 16.3838C12.6197 17.1806 11.3801 17.1806 10.6829 16.3838L5.16108 10.0731ZM6.65274 9.5L11.8118 15.396C11.9114 15.5099 12.0885 15.5099 12.1881 15.396L17.3471 9.5H6.65274Z" fill="gray"/>
        }
        </svg>
        </span>
        </div>
      </div>
      }
  {
  showingFilter && <div>{obs.map((ob, i) => (
    <div key={`k-${i}`} style={{backgroundColor:'#FFF', marginBottom:5, padding:8, borderRadius:3}}>
      <span style={{fontWeight:800}}>{`${ob[0]}: `}</span>
      {
        ob[1].map((o, j)=> (
          <span key={`feat-${j}`}>
            <Checkbox data={o}/>
          </span>
        ))
      }
    </div>
  ))}</div>
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