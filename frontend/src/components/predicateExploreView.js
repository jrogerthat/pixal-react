import { useEffect, useMemo, useState } from 'react'
import '../App.css';
import { useAxiosGet } from '../axiosUtil';
import { PredExplorePlot } from './plots/predExplorerPlot';



function PredicateExplore({colorDict, highlightPred}) {

  const [predicateDistributions, setPredicateDistributions] = useState([]);

  let {data, error, loaded} = useAxiosGet('/get_pred_dis');
  useEffect(()=> {
    if(loaded){
      setPredicateDistributions(Object.entries(data))
    }
  }, [loaded])
  

  return (
    <div className="pred-exp-view">

      <div className="pred-dist-plot">
        <PredExplorePlot width={900} height={600} distData={predicateDistributions} colorDict={colorDict} highlightPred={highlightPred} />
      </div>
    
    </div>
  );
}

export default PredicateExplore;