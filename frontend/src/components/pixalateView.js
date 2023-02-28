import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';
import { PixalFeatureNav, PixalFeatureNavWrap } from './pixalFeatureNav';
import { MarksControlComponent } from './markComponent';
import { PivotPlot } from './plots/PivotPlot';
import { ExplanationComponent } from './explanationComp';

function Pixalate() {

  const [{selectedPredicate}, dispatch] = useContext(DataContext);
  const [xCoord, setXCoord] = useState('Score');

  let predicateFeatureArray = useMemo(()=> {
    return (selectedPredicate && selectedPredicate.attribute_data != null) ? Object.entries(selectedPredicate.attribute_data) : [];
  }, [selectedPredicate]);

  const rightDivRef = useRef();

 console.log(selectedPredicate)

  if(selectedPredicate && !selectedPredicate.attribute_data){
    return(
      <div className="splash-select">Unable to process, please choose another predicate.</div>
    )
  }else if(selectedPredicate && !!selectedPredicate.feature){
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
          <PivotPlot xCoord={xCoord} setXCoord={setXCoord} />

          <div className="r-bottom">
          <div>explanation</div>
          <ExplanationComponent xCoord={xCoord}/>
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