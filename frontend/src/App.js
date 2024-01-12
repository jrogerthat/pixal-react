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

// function SwitchLabels() {
//   return (
//     <FormGroup>
//       <FormControlLabel control={<Switch defaultChecked />} label="Label" />
//     </FormGroup>
//   );
// }

function App() {
  
   // new line start
  const [{editMode}, dispatch] = useContext(DataContext);
  const [plotMode, setPlotMode] = useState('overlap');
  /**
   * This loads an object with pred_dist (list of predicate distribtutions) and pred_list (pred_list)
   */
  let {data, error, loaded} = useAxiosGet('/get_predicate_data');
 
  useEffect(() => {
    if(loaded){ 
      console.log('data', data)
      dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData: data, parentToChildDict: null})
    }
    
  }, [loaded])

  return (
    <div className="App">
      <AppBar position="static" sx = {{ background: 'white', padding: "10px", flexDirection:"row"}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
        {editMode && <FormGroup>
        <FormControlLabel 
          control={<Switch defaultChecked />} 
          label={plotMode} 
          onChange={() => plotMode === 'overlap' ? setPlotMode('multiples') : setPlotMode('overlap')}/>
        </FormGroup>}
        <BasicDrop />
      </AppBar>
      <div className="main-wrapper">
        {editMode ? (
          plotMode === 'overlap' ? <React.Fragment>
            <PredicateNav /><PredicateExplore /> 
            </React.Fragment> : <SmallMultiple />
        ): (
          <Pixalate />
        )}
      </div>
    </div>
   
  );
}

export default App;