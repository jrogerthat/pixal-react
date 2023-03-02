import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';
import { PixalFeatureNav, PixalFeatureNavWrap } from './pixalFeatureNav';
import { MarksControlComponent } from './markComponent';
import { PivotPlot } from './plots/PivotPlot';
import { ExplanationComponent } from './explanationComp';
import { Button } from '@mui/material';
import { BookmarkComponent } from './bookmarkComp';
import Tabs from './tabComponent';
import TabComponent from './tabComponent';

function Pixalate() {

  const [{selectedPredicate}, dispatch] = useContext(DataContext);
  const [yCoord, setYCoord] = useState('Score');
  const [explanationBool, setExplanationBool] = useState(true);

  const rightDivRef = useRef();

  if(selectedPredicate && !selectedPredicate.attribute_data){
    return(
      <div className="splash-select">Unable to process, please choose another predicate.</div>
    )
  }else if(selectedPredicate && !!selectedPredicate.feature){
    return(
      <div className="pixalate">
      
           <PixalFeatureNavWrap 
           classN={"l-top"}
          />
        
          <div className="l-bottom">
          <div>Predicate I_Forest Score</div>
          <PredScorePlot />
          </div>
          {/* PIVOT PLOT HAD THE RIGHT TOP */}
          <PivotPlot yCoord={yCoord} setYCoord={setYCoord} />

          <div className="r-bottom">
            <div>
              <TabComponent yCoord={yCoord}/>
            {/* <Button
              onClick={() => setExplanationBool(true)}
              >Explanation</Button>
            <Button
              onClick={() => setExplanationBool(false)}
              >Bookmarked</Button> */}
            </div>
         
            {/* {
              explanationBool ?  <ExplanationComponent yCoord={yCoord}/>
              : <BookmarkComponent />
            } */}
         
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