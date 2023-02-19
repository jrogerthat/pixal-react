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
import randomColor from 'randomcolor'

function App() {

   // new line start
  const [predEditMode, setPredEditMode] = useState(true);
  const [highlightPred, setHighlightPred] = useState(null);
  
  const [selectedPredicateData, setSelectedPredData] = useState(null);
  const [predicateArray, setPredicateArray] = useState([])

  /**NEED TO INCORPORATE SELECTED PRED >> SELECTED FEATURE FOR PIVOT
   * 
   */

  

  const { data } = useAxiosGet('/load_predicates');
  // const predicateArray = useMemo(() => {
  //   return data || [];
  // }, [data]);
  useEffect(() => {
    setPredicateArray(data || [])
  }, [data])


  let colorDict = useMemo(() => {
    if(predicateArray != []){
      return Object.entries(predicateArray).map(c => {
        return {id: c[0], color: randomColor()}
      })
    }else{
      return []
    }
  }, [data]);



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
        colorDict={colorDict}
        setHighlightPred={setHighlightPred}
        ></PredicateNav>
        {predEditMode ? (
          <PredicateExplore colorDict={colorDict} highlightPred={highlightPred}/>
        ): (
          <Pixalate/>
        )}
      </div>
    
    </div>
  );
}

export default App;