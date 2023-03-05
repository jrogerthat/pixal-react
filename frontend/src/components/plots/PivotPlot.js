import * as d3 from "d3";
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
    // const [xCoord, setXCoord] = useState(selectedPredicate.feature[0]);
    const [filterByArray, setFilterByArray] = useState([]);
   
  
    return (
        <div className="r-top">
        <MarksControlComponent 
            setFilterByArray={setFilterByArray}
        />
        <div>
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
                <div>
                    <CoordDrop 
                    options={yOptions} 
                    label={"y"} 
                    // setHandle={setYCoord} 
                    type={"yCoord"}
                    />
                    {/* <CoordDrop options={selectedPredicate.features} label={"y"} /> */}
                </div>
            </div>
            <div>
                {/* <CoordDrop options={selectedPredicate.features} label={"Filter by"} /> */}
                <div><FilterList /></div>
            </div>
        </div>
    )
}

const tableValues = (arr) => {

}

const FilterList = () => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    let rows = Object.entries(selectedPredicate.predicate_info.predicate.attribute_values);
   
    return (
        <TableContainer component={Paper}>
        <Table 
        sx={{ backgroundColor: '#f4efefe0', fontSize: 9}} 
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

    if(categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1){
        setEncoding('bar')
        return  <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool} feature={selectedPredicate.feature[0]} />
    }else if(selectedPredicate.feature[0] === "Order-Date"){
        setEncoding('line')
        return <FeatureLinePlot xCoord={xCoord} yCoord={yCoord} />
    }else{
        setEncoding('dot')
        return <FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/>
    }
}

const CoordDrop = ({options, label, setHandle, type}) => {

    const [{xCoord}, dispatch] = useContext(DataContext);

    const [coord, setCoord] = useState('');

    const handleChange = (event) => {
        setCoord(event.target.value)
        // setHandle(event.target.value);
        // xCoord: action.coords.x, yCoord: action.coords.y
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
