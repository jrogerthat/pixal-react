import { useState } from 'react'
import axios from "axios";
import './App.css';
import PredicateNav from './components/PredicateNav';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Pixalate from './components/pixalateView';
import PredicateExplore from './components/predicateExploreView';
import BasicDrop from './components/headerDropdown';

function App() {

   // new line start
  const [predEditMode, setPredEditMode] = useState(true);



  return (
    <div className="App">
     
      <AppBar position="static" sx = {{ background: 'white', padding: "10px", flexDirection:"row"}}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
        <BasicDrop predEditMode={predEditMode} setPredEditMode={setPredEditMode} />
      </AppBar>
      <div className="main-wrapper">
        <PredicateNav setPredEditMode={setPredEditMode} predEditMode={predEditMode}></PredicateNav>
        {predEditMode ? (
          <PredicateExplore/>
        ): (
          <Pixalate/>
        )}
      </div>
    
    </div>
  );
}

export default App;