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
            onClick={() => dispatch({type: "ADD_BOOKMARK_PLOT", bookmarked: {'x': xCoord, 'y': yCoord, 'encoding': encoding, 'selectedPredicate': {...selectedPredicate}, 'feature': selectedPredicate.feature}})}
            ><BookmarkAddIcon/>Bookmark Plot</Button>
            </div>
        </div>
      </div>
    )
}

export const MarksControlComponent = () => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])
    let yOptions = ['Score', ...keys]


    return(
        <div className="marksControl">
            {/* <div>
                <CoordDrop options={['point', 'bar', 'line']} label={"marks"} setHandle={setEncoding} />
            </div> */}

           
            <div>
                <div>encoding</div>
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
                <CoordDrop options={selectedPredicate.features} label={"Filter by"} />
            </div>
        </div>
    )
}

const WhichPlot = ({setEncoding}) => {
    const [{categoricalFeatures, selectedPredicate, xCoord, yCoord}, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;
   
    // if(encoding === null){

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
    // }else if(encoding === 'point'){
    //     return <FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/>
    // }
    // return (
    //     <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool} feature={selectedPredicate.feature[0]} />
    // )
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
