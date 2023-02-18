import { useMemo, useState } from 'react'
import '../App.css';
import { useAxiosGet } from '../axiosUtil';
import ReactDOM from 'react-dom';
import { PredExplorePlot } from './predExplorerPlot';



function PredicateExplore({colorDict, highlightPred}) {

  const { data, error, loaded } = useAxiosGet('/get_pred_dis');
  /**
   * This gets the data form the end point and checks if its null. this is the data used in the distribution plots.
   * it has data_distributions and feature domains
   */
  const predArray = useMemo(() => {
    console.log('DATA???', data)
    return data !== null ? Object.entries(data.data_distributions) : [];
  }, [data]);

  


  return (
    <div className="pred-exp-view">

      <div className="pred-dist-plot">
        <PredExplorePlot width={900} height={600} distData={predArray} colorDict={colorDict} highlightPred={highlightPred} />
      </div>
    
    </div>
  );
}

export default PredicateExplore;