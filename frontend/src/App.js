import { useState } from 'react'
import axios from "axios";
import './App.css';
import PredicateNav from './components/PredicateNav';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Pixalate from './components/pixalateView';
import PredicateExplore from './components/predicateExploreView';

function App() {

   // new line start
  const [profileData, setProfileData] = useState(null);
  const [predEditMode, setPredEditMode] = useState(true);

  function getData() {
    axios({
      method: "GET",
      url:"/profile",
    })
    .then((response) => {
      const res =response.data
      setProfileData(({
        profile_name: res.name,
        about_me: res.about}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}
    //end of new line 

  return (
    <div className="App">
      {/* <div className="header">PIXAL</div> */}
      <AppBar position="static" sx = {{ background: 'white', padding: "10px"}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'GrayText' }}>PIXAL</Typography>
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