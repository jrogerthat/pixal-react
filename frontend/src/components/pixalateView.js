import React, { useContext } from 'react'
import '../App.css';
import { DataContext } from '../context';
import { PivotPlot } from './plots/PivotPlot';
import TabComponent from './tabComponent';

function Pixalate() {

  const [{selectedPredicate}] = useContext(DataContext);

  if(selectedPredicate && !selectedPredicate.attribute_data){
    return(
      <div className="splash-select">Unable to process, please choose another predicate.</div>
    )
  }else if(selectedPredicate){
    
    return(
      <div className="pixalate">

        <div className="right-wrap">
      {
        selectedPredicate.feature && (
          <React.Fragment>
          <div className="head-3" style={{marginBottom:10}}>{`Explanation for Predicate ${selectedPredicate.predicate_id}`}</div>
          <PivotPlot />
          <div 
          className="r-bottom" 
          style={{marginTop:10}}>
            <div>
              <TabComponent />
            </div>
          </div>
          </React.Fragment>
        )
      }
        </div>
      </div>
    )
  }

  return (
    <div className="splash-select">Choose a predicate to get started.</div>
  )
}

export default Pixalate;