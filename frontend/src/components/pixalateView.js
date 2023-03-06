import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';
import { PixalFeatureNav, PixalFeatureNavWrap } from './pixalFeatureNav';
import { PivotPlot } from './plots/PivotPlot';
import TabComponent from './tabComponent';
import Typography from '@mui/material/Typography';

function Pixalate() {

  const [{selectedPredicate}, dispatch] = useContext(DataContext);
  // const [yCoord, setYCoord] = useState('Score');

  const rightDivRef = useRef();

  if(selectedPredicate && !selectedPredicate.attribute_data){
    return(
      <div className="splash-select">Unable to process, please choose another predicate.</div>
    )
  }else if(selectedPredicate && !!selectedPredicate.feature){
    return(
      <div className="pixalate">
        <div className="left-wrap">
        <PixalFeatureNavWrap classN={"l-top"} />
        <div className="l-bottom">
        <div className="head-3">Predicate I_Forest Scores</div>
        <PredScorePlot navBool={true}/>
        </div>
        </div>

        <div className="right-wrap">
          <PivotPlot />
          <div className="r-bottom" style={{marginTop:10}}>
            <div>
              <TabComponent />
            </div>
          </div>
        </div>
      </div>
    )
  }else if(selectedPredicate){
    return (
      <div className="pixalate-two" id="pixalate-two-group">
      
          <PixalFeatureNavWrap 
          classN={"left"} 
          />

          <div className="right"
          ref={rightDivRef}
          >
            <div className="head-3">Predicate I_Forest Scores</div>
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