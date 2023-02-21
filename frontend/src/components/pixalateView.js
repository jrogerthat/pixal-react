import { useContext, useEffect, useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import { PredScorePlot } from './plots/predScorePlot';
import { DataContext } from '../context';

function Pixalate() {

  const [{selectedPredicate}, dispatch] = useContext(DataContext);



  if(selectedPredicate && !!selectedPredicate.feature){
    return(
      <div className="pixalate">
        <div className="l-top">
          <div>score</div>
          <PredScorePlot predScoreArray={selectedPredicate.predicate_scores} width={440} height={300} />
          </div>
        
          <div className="l-bottom">
            <div>feature</div>
          </div>

          <div className="r-top">
            <div>marks</div>
          </div>

          <div className="r-bottom">
          <div>explaination</div>
        </div>
    </div>
    )
  }else if(selectedPredicate){
    return (
      <div className="pixalate-two">
        
        
          <div className="right">
            <div>feature</div>
          </div>

          <div className="left">
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