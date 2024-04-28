import React, { useContext, useEffect, useState } from 'react'
import './App.css';
import PredicateNav from './components/PredicateNav';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Pixalate from './components/pixalateView';
import PredicateExplore from './predicateExploreComponents/predicateExploreView';
import BasicDrop from './components/headerDropdown';
import { useAxiosGet } from './axiosUtil';
import { DataContext } from './context';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SmallMultiple from './components/SmallMultiple';
import { Badge, Button } from '@mui/material';


function App() {
  
   // new line start
  const [{plotMode, plotStyle, selectedPredicate}, dispatch] = useContext(DataContext);
  // const [plotMode, setPlotMode] = useState('overlap');
  /**
   * This loads an object with pred_dist (list of predicate distribtutions) and pred_list (pred_list)
   */
  let {data, error, loaded} = useAxiosGet('/get_predicate_data');
 
  useEffect(() => {
    
    if(loaded){ 
     
      dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData: data.predicates, parentToChildDict: data.parent_dict, dataTypes: data.dtypes})
    }
    
  }, [loaded])

  return (
    <div className="App">
      <AppBar position="static" sx = {{ background: 'white', padding: "10px", flexDirection:"row"}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
        {/* {!selectedPredicate && <FormGroup>
        <FormControlLabel 
          control={<Switch defaultChecked />} 
          label={plotMode} 
          style={{color:'gray'}}
          onChange={() => {
            let plot = plotMode === 'overlap' ? 'multiples' : 'overlap';
            // let plot = plotMode === 'overlap' ? 'multiples' : 'overlap';
            dispatch({ type:"UPDATE_PLOT_MODE", plotMode: plot})
            }}/>
        </FormGroup>
        } */}
          {!selectedPredicate && <FormGroup>
        <FormControlLabel 
          control={<Switch defaultChecked />} 
          label={plotStyle} 
          style={{color:'gray'}}
          onChange={() => {
            let plot = plotStyle === 'histogram' ? 'area' : 'histogram';
            dispatch({ type:"UPDATE_PLOT_STYLE", plotStyle: plot})
            }}/>
             </FormGroup>
        }
        {/* <BasicDrop /> */}
        {selectedPredicate && (<Button
        variant={"contained"}
        onClick={()=> {
          dispatch({type: "UNSELECT_PREDICATE"})
        }}
        ><span style={{paddingRight:10}}>Unselect Predicate</span> <svg 
        fill="#000000" height="20px" width="20px" 
        viewBox="0 0 300.003 300.003">
     <g>
       <g>
         <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150
           C300.002,67.159,232.839,0,150,0z M206.584,207.171c-5.989,5.984-15.691,5.984-21.675,0l-34.132-34.132l-35.686,35.686
           c-5.986,5.984-15.689,5.984-21.672,0c-5.989-5.991-5.989-15.691,0-21.68l35.683-35.683L95.878,118.14
           c-5.984-5.991-5.984-15.691,0-21.678c5.986-5.986,15.691-5.986,21.678,0l33.222,33.222l31.671-31.673
           c5.986-5.984,15.694-5.986,21.675,0c5.989,5.991,5.989,15.697,0,21.678l-31.668,31.671l34.13,34.132
           C212.57,191.475,212.573,201.183,206.584,207.171z" fill="#ffffff"/>
       </g>
     </g>
     </svg></Button>)}
      </AppBar>
      <div className="main-wrapper">
        {!selectedPredicate ? (
         <SmallMultiple />
        ): (
          <React.Fragment>
          <SmallMultiple /><Pixalate />
          </React.Fragment>
          
        )}
      </div>
      {/* <div className="main-wrapper">
        {!selectedPredicate ? (
          plotMode === 'overlap' ? <React.Fragment>
            <PredicateNav /><PredicateExplore /> 
            </React.Fragment> : <SmallMultiple />
        ): (
          <React.Fragment>
          <PredicateNav /><Pixalate />
          </React.Fragment>
          
        )}
      </div> */}
    </div>
   
  );
}

export default App;