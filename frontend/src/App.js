import { useEffect, useMemo, useState } from 'react'
import './App.css';
import PredicateNav from './components/PredicateNav';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Pixalate from './components/pixalateView';
import PredicateExplore from './components/predicateExploreView';
import BasicDrop from './components/headerDropdown';
import { useAxiosGet } from './axiosUtil';
import formatPredicateArray from './dataFormating';

function App() {

   // new line start
  const [predEditMode, setPredEditMode] = useState(true);
  const [highlightPred, setHighlightPred] = useState(null);
  
  const [selectedPredicateData, setSelectedPredData] = useState(null);
  const [predicateArray, setPredicateArray] = useState([]);
  const [predicateDistributions, setPredicateDistributions] = useState([]);
  
  const [hiddenPreds, setHiddenPreds] = useState([]);

  /**NEED TO INCORPORATE SELECTED PRED >> SELECTED FEATURE FOR PIVOT
   * 
   */

  //TODO: Creat new ends points for what view you are in. 

  /**
   * This loads an object with pred_dist (list of predicate distribtutions) and pred_list (pred_list)
   */
  let {data, error, loaded} = useAxiosGet('/load_predicates_dist_list');
 
  useEffect(() => {
    if(loaded){
      let arr = formatPredicateArray(data.pred_list);
      setPredicateArray(arr)
      setPredicateDistributions(Object.entries(data.pred_dist))
      
    }
    
  }, [loaded])


  return (
    <div className="App">
     
      <AppBar position="static" sx = {{ background: 'white', padding: "10px", flexDirection:"row"}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
        <BasicDrop predEditMode={predEditMode} setPredEditMode={setPredEditMode} />
      </AppBar>
      <div className="main-wrapper">
        <PredicateNav 
        setPredEditMode={setPredEditMode} 
        predEditMode={predEditMode} 
        predicateArray={predicateArray}
        setPredicateArray={setPredicateArray}
        setHighlightPred={setHighlightPred}
        ></PredicateNav> 
        {predEditMode ? (
          <PredicateExplore 
          highlightPred={highlightPred} 
          predicateArray={predicateArray}
          predicateDistributions={predicateDistributions}
          />
        ): (
          <Pixalate/>
        )}
      </div>
    
    </div>
  );
}

export default App;