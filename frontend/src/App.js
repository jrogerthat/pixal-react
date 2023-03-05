import { useContext, useEffect, useState } from 'react'
import './App.css';
import PredicateNav from './components/PredicateNav';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Pixalate from './components/pixalateView';
import PredicateExplore from './components/predicateExploreView';
import BasicDrop from './components/headerDropdown';
import { useAxiosGet, useGetAxiosAsync } from './axiosUtil';
import { DataContext } from './context';



function App() {
  
   // new line start

  const [{editMode}, dispatch] = useContext(DataContext);

  /**
   * This loads an object with pred_dist (list of predicate distribtutions) and pred_list (pred_list)
   */
  let {data, error, loaded} = useAxiosGet('/get_predicate_data');
 
  useEffect(() => {
    if(loaded){ 
     
      let pred_dist = Object.entries(data).map(m => {
        return [m[0], m[1].dist]
      });

      let predData = {'pred_list': data, 'pred_dist': pred_dist}
      dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData})
    }
    
  }, [loaded])

  // let {data, error, loaded} = useAxiosGet('/load_predicates_dist_list');

  // useEffect(() => {
  //   if(loaded){ 

 
  //     let pred_dist = Object.entries(data.pred_dist)


  //     let predData = {'pred_list': data.pred_list, 'pred_dist': pred_dist}
  //     dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData})
  //   }
    
  // }, [loaded])


  return (
    <div className="App">
      <AppBar position="static" sx = {{ background: 'white', padding: "10px", flexDirection:"row"}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
        <BasicDrop />
      </AppBar>
      <div className="main-wrapper">
        <PredicateNav /> 
        {editMode ? (
          <PredicateExplore />
        ): (
          <Pixalate />
        )}
      </div>
    </div>
   
  );
}

export default App;