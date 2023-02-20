import { useEffect, useMemo, useState } from 'react'
import '../App.css';
import { useAxiosGet, useGetDistributions } from '../axiosUtil';
import { PredExplorePlot } from './plots/predExplorerPlot';



function PredicateExplore({highlightPred, predicateArray, predicateDistributions}) {

  // const [predicateDistributions, setPredicateDistributions] = useState([]);

  // let {data, error, loaded} = useAxiosGet('/get_pred_dis');
  // useEffect(()=> {
  //   if(loaded){
  //     setPredicateDistributions(Object.entries(data))
  //   }
  // }, [loaded])
  // useEffect(() => {
   
  //   console.log('PREDICATE ARRAY', predicateArray);

  //   let {data, error, loaded} = useAxiosGet('/get_pred_dis');
  //   useEffect(()=> {
  //     if(loaded){
  //       setPredicateDistributions(Object.entries(data))
  //     }
  //   }, [loaded])
    
  // }, [predicateArray])


  // useGetDistributions().then((data)=> setPredicateDistributions(Object.entries(data.data)));
 
  
 

  return (
    <div className="pred-exp-view">

      <div className="pred-dist-plot">
        <PredExplorePlot width={900} height={600} distData={predicateDistributions} predicateArray={predicateArray} highlightPred={highlightPred} />
      </div>
    
    </div>
  );
}

export default PredicateExplore;