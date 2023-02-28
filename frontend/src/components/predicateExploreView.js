import { useEffect, useMemo, useState } from 'react'
import '../App.css';
import { useAxiosGet, useGetDistributions } from '../axiosUtil';
import { PredExplorePlot } from './plots/predExplorerPlot';



function PredicateExplore() {

  return (
    <div className="pred-exp-view">

      <div className="pred-dist-plot">
        <PredExplorePlot 
        width={900} 
        height={600} 
        />
      </div>
    
    </div>
  );
}

export default PredicateExplore;