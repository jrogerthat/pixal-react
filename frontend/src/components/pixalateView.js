import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';
import { PixalFeatureNav, PixalFeatureNavWrap } from './pixalFeatureNav';
import { MarksControlComponent } from './markComponent';
import { PivotPlot } from './plots/PivotPlot';

function Pixalate() {

  const [{selectedPredicate}, dispatch] = useContext(DataContext);

  let predicateFeatureArray = useMemo(()=> {
    return selectedPredicate ? Object.entries(selectedPredicate.attribute_data) : [];
  }, [selectedPredicate]);

  const [predScoreWidth, setPredScoreWidth] = useState(600);

  const rightDivRef = useRef();

  useEffect(()=> {
    if(rightDivRef.current){

    }
  }, [rightDivRef])

  if(selectedPredicate && !!selectedPredicate.feature){
    return(
      <div className="pixalate">
      
           <PixalFeatureNavWrap 
           classN={"l-top"} 
           predicateFeatureArray={predicateFeatureArray}/>
        
          <div className="l-bottom">
          <div>Predicate I_Forest Score</div>
          <PredScorePlot />
          </div>
          {/* PIVOT PLOT HAD THE RIGHT TOP */}
          <PivotPlot />

          <div className="r-bottom">
          <div>explanation</div>
        </div>
    </div>
    )
  }else if(selectedPredicate){
    return (
      <div className="pixalate-two">
      
          <PixalFeatureNavWrap 
          classN={"left"} 
          predicateFeatureArray={predicateFeatureArray}/>

          <div className="right"
          ref={rightDivRef}
          >
          <div>Predicate I_Forest Score</div>
          <PredScorePlot />
          </div>

    </div>
    )
  }
  return (
    <div className="splash-select">Choose a predicate to get started.</div>
  )
}

export default Pixalate;