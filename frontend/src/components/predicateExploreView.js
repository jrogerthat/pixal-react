import { useMemo, useState } from 'react'
import '../App.css';
import { useAxiosGet } from '../axiosUtil';
import ReactDOM from 'react-dom';
import { Vega } from 'react-vega';


function PredicateExplore() {

  const { data, error, loaded } = useAxiosGet('/load_spec');
  const spec = useMemo(() => {
    return data || [];
  }, [data]);

  console.log('SPEC',spec)

 

  const barData = spec['datasets']

  console.log(barData)
 
  
  function handleHover(...args){
    console.log(args);
  }
  
  const signalListeners = { hover: handleHover };
  


  return (
    <div className="pred-exp-view">
     <Vega spec={spec} data={barData} />
    </div>
  );
}

export default PredicateExplore;