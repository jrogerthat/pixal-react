import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';
import { PixalFeatureNav } from './pixalFeatureNav';
import { MarksControlComponent } from './markComponent';
import { PivotPlot } from './plots/PivotPlot';

function Pixalate() {

  const [{selectedPredicate}, dispatch] = useContext(DataContext);
  const [plotWidth, setPlotWidth] = useState(400);

  let predicateFeatureArray = useMemo(()=> {
    return selectedPredicate ? Object.entries(selectedPredicate.attribute_data) : [];
  }, [selectedPredicate]);

  const divRefTwo = useRef();
  const divRefFour = useRef();
  
  useEffect(() => {
    // I don't think it can be null at this point, but better safe than sorry
     if (selectedPredicate && !!selectedPredicate.feature && divRefFour.current) {
      
        setPlotWidth(window.getComputedStyle(divRefFour.current).width);
       
     }else if(divRefTwo.current){
    
        setPlotWidth(window.getComputedStyle(divRefTwo.current).width);
  
     }
   }, [divRefTwo.current, divRefFour.current]);

  if(selectedPredicate && !!selectedPredicate.feature){
    return(
      <div className="pixalate">
        <div className="l-top" ref={divRefFour}>
          <div>features</div>
            {
              predicateFeatureArray.map(f => (
                <PixalFeatureNav key={`${f[0]}`} feature={f} divWidth={plotWidth}/>
              ))
            }
          </div>
        
          <div className="l-bottom">
          <div>score</div>
          <PredScorePlot width={440} height={200} />
          </div>

          <PivotPlot />

          <div className="r-bottom">
          <div>explanation</div>
        </div>
    </div>
    )
  }else if(selectedPredicate){
    return (
      <div className="pixalate-two">
        
        
          <div className="left" ref={divRefTwo}>
            <div>feature</div>
            {
              predicateFeatureArray.map(f => (
                <PixalFeatureNav key={`${f[0]}`} feature={f}/>
              ))
            }
          </div>

          <div className="right">
          <div>score</div>
          <PredScorePlot predScoreArray={selectedPredicate.predicate_scores} width={600} height={300} />
          </div>

    </div>
    )
  }
  return (
    <div className="splash-select">Choose a predicate to get started.</div>
  )
}

export default Pixalate;