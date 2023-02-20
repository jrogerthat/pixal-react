import { useState } from 'react'
import '../App.css';
import Button from '@mui/material/Button';
import { PredScorePlot } from './plots/predScorePlot';

function Pixalate() {

  return (
    <div className="pixalate">
      
        <div className="l-top">
          <div>score</div>
          <PredScorePlot PredData={[]} width={300} height={300} />
          </div>
        <div className="r-top">
          <div>marks</div>
          </div>
        <div className="l-bottom">
          <div>feature</div>
          </div>
        <div className="r-bottom">
          <div>explaination</div>
        </div>
      
    </div>
  );
}

export default Pixalate;