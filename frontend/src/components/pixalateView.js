import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';
import { PixalFeatureNav, PixalFeatureNavWrap } from './pixalFeatureNav';
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
        <div className="left-wrap">
        <PixalFeatureNavWrap classN={"l-top"} />
        <div className="l-bottom">
        <div className="head-3">Anomaly Scores</div>
        <PredScorePlot />
        </div>
        </div>

        <div className="right-wrap">
      {
        selectedPredicate.feature && (
          <React.Fragment>
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