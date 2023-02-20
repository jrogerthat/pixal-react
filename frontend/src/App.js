import { useContext, useEffect, useState } from 'react'
import './App.css';
import PredicateNav from './components/PredicateNav';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Pixalate from './components/pixalateView';
import PredicateExplore from './components/predicateExploreView';
import BasicDrop from './components/headerDropdown';
import { useAxiosGet, useGetAxiosAsync } from './axiosUtil';
import formatPredicateArray from './dataFormating';
import { DataContext } from './context';



function App() {
  
   // new line start
  const [predEditMode, setPredEditMode] = useState(true);
  const [highlightPred, setHighlightPred] = useState(null);  
  const [hiddenPreds, setHiddenPreds] = useState([]);

  const [{predicateArray, selectedPredicate}, dispatch] = useContext(DataContext);


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
      let pred_dist = Object.entries(data.pred_dist)
      let predData = {'pred_list': arr, 'pred_dist': pred_dist}
      dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData})
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
          setHighlightPred={setHighlightPred}
          hiddenPreds={hiddenPreds}
          setHiddenPreds={setHiddenPreds}
        ></PredicateNav> 
        {predEditMode ? (
          <PredicateExplore 
          highlightPred={highlightPred} 
          hiddenPreds={hiddenPreds}
          />
        ): (
          <Pixalate />
        )}
      </div>
    </div>
   
  );
}

export default App;