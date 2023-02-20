import { useEffect, useMemo, useState } from 'react'
import '../App.css';
import { useAxiosGet, useGetDistributions } from '../axiosUtil';
import { PredExplorePlot } from './plots/predExplorerPlot';



function PredicateExplore({highlightPred, predicateArray, predicateDistributions, hiddenPreds}) {

  
  return (
    <div className="pred-exp-view">

      <div className="pred-dist-plot">
        <PredExplorePlot 
        width={900} 
        height={600} 
        distData={predicateDistributions} 
        predicateArray={predicateArray} 
        highlightPred={highlightPred} 
        hiddenPreds={hiddenPreds}
        />
      </div>
    
    </div>
  );
}

export default PredicateExplore;