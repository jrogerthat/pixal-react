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

// function SwitchLabels() {
//   return (
//     <FormGroup>
//       <FormControlLabel control={<Switch defaultChecked />} label="Label" />
//     </FormGroup>
//   );
// }

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
      console.log('PREDDATA', data)
      dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData: data, parentToChildDict: null})
    }
    
  }, [loaded])

  return (
    <div className="App">
      <AppBar position="static" sx = {{ background: 'white', padding: "10px", flexDirection:"row"}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
        {!selectedPredicate && <FormGroup>
        <FormControlLabel 
          control={<Switch defaultChecked />} 
          label={plotMode} 
          style={{color:'gray'}}
          onChange={() => {
            let plot = plotMode === 'overlap' ? 'multiples' : 'overlap';
            dispatch({ type:"UPDATE_PLOT_MODE", plotMode: plot})
            }}/>
        </FormGroup>
        }
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
        onClick={()=> {
          dispatch({type: "UNSELECT_PREDICATE"})
        }}
        >Unselect Predicate</Button>)}
      </AppBar>
      <div className="main-wrapper">
        {!selectedPredicate ? (
          plotMode === 'overlap' ? <React.Fragment>
            <PredicateNav /><PredicateExplore /> 
            </React.Fragment> : <SmallMultiple />
        ): (
          <React.Fragment>
          <PredicateNav /><Pixalate />
          </React.Fragment>
          
        )}
      </div>
    </div>
   
  );
}

export default App;