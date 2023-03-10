import * as d3 from "d3";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FeatureBarPlot } from "./featureBarPlot";
import { FeatureDotPlot } from "./featureDotPlot";
import { Button } from "@mui/material";
import { FeatureLinePlot } from "./featureLinePlot";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const  PivotPlot = () => {

    const [{selectedPredicate, xCoord, yCoord}, dispatch] = useContext(DataContext);
    const [encoding, setEncoding] = useState(null);
    const [filterByArray, setFilterByArray] = useState([]);
   
    return (
        <div className="r-top">
        <MarksControlComponent 
            setFilterByArray={setFilterByArray}
        />
        <div id="pivot-plot">
           <WhichPlot setEncoding={setEncoding} />
           <div className="bookmark-button">
            <Button
            onClick={() => {
                dispatch({type: "ADD_BOOKMARK_PLOT", bookmarked: {'x': xCoord, 'y': yCoord, 'encoding': encoding, 'selectedPredicate': {...selectedPredicate}, 'feature': selectedPredicate.feature, 'explanation': getExplanation(xCoord, yCoord, selectedPredicate)}})}}
            ><BookmarkAddIcon/>Bookmark Plot</Button>
            </div>
        </div>
      </div>
    )
}

const getExplanation = (xC, yC, selectedPredicate) => {
    if(yC === 'Score'){
        return selectedPredicate.attribute_score_data[xC][1];
    }else{
        return selectedPredicate.feature[1][yC][1];
    }
}

export const MarksControlComponent = () => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])
    let yOptions = ['Score', ...keys]

    return(
        <div className="marksControl">
            <div>
                <div className="head-3">encoding</div>
                <div style={{display:'flex', flexDirection:'row', color:'gray'}}>
                    <div>
                        <CoordDrop 
                        options={yOptions} 
                        label={"y"} 
                        type={"yCoord"}
                        />
                    </div>
                    <div>
                        <div>{"x:"}</div>
                        {selectedPredicate.feature[0]}
                    </div>
                </div>
            </div>
            <div>
                <div><FilterList /></div>
            </div>
        </div>
    )
}

const FilterList = () => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    let rows = Object.entries(selectedPredicate.predicate_info.predicate.attribute_values);
    
    return (
        <TableContainer component={Paper}>
        <Table 
        sx={{ backgroundColor: '#f4efefe0', fontSize: 8, width:200 }} 
        aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Filtered By:</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row, i) => (
                <TableRow
                key={`fil-${i}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    
                <TableCell component="th" scope="row">
                <span>{`${row[0]}: `}</span> 
                </TableCell>
                <TableCell align="right">{row[1].join(", ")}</TableCell>
                
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

const WhichPlot = ({setEncoding}) => {
    const [{categoricalFeatures, selectedPredicate, xCoord, yCoord}, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;

    let getPivotLabel = () => {
        let chosenVal = selectedPredicate.predicate_info.predicate.attribute_values[selectedPredicate.feature[0]];
      
        return <div
        style={{marginTop:20, marginLeft:10, fontWeight:800}}
        >{`${xCoord}: ${chosenVal.join(', ')}`}</div>
    }

    if(categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1){
        setEncoding('bar')
        return  <div>
            {getPivotLabel()}
            <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool} feature={selectedPredicate.feature[0]} /></div>
    }else if(selectedPredicate.feature[0] === "Order-Date"){
        setEncoding('line')
        return <div>
        <div>{getPivotLabel()}</div><FeatureLinePlot xCoord={xCoord} yCoord={yCoord} /></div>
    }else{
        setEncoding('dot')
        return <div>
        <div>{getPivotLabel()}</div><FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/></div>
    }
}

const CoordDrop = ({options, label, setHandle, type}) => {

    const [{xCoord, yCoord}, dispatch] = useContext(DataContext);

    const [coord, setCoord] = useState('Score');

    useEffect(() => {
       
        setCoord(yCoord)
    }, [yCoord])

    const handleChange = (event) => {
        // setCoord(event.target.value)
        if(type === "yCoord"){
            dispatch({type: "UPDATE_AXIS", coords: {x: xCoord, y: event.target.value}})
        }
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
        <InputLabel id="demo-select-small">{label}</InputLabel>
        <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={coord}
            label={label}
            onChange={handleChange}
        >{
            options.map(op => (
                <MenuItem key={op} value={op}>{op}</MenuItem>
            ))
        }
        </Select>
        </FormControl>
    );
  
}
