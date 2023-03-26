import '../App.css';
import { PredExplorePlot } from '../components/plots/predExplorerPlot';

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