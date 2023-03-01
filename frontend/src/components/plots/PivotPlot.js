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

export const  PivotPlot = ({yCoord, setYCoord}) => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const [encoding, setEncoding] = useState(null);
    const [xCoord, setXCoord] = useState(selectedPredicate.feature[0]);
    const [filterByArray, setFilterByArray] = useState([]);
    const divRef = useRef();

    
  
    return (
        <div className="r-top">
        <MarksControlComponent 
            setEncoding={setEncoding} 
            setYCoord={setYCoord} 
            setFilterByArray={setFilterByArray}
        />
        <div ref={divRef}>
            <div>plot</div>
           <WhichPlot xCoord={xCoord} yCoord={yCoord} encoding={encoding} />
           <div className="bookmark-button">
            <Button
            onClick={() => console.log('button')}
            >Bookmark Plot</Button>
            </div>
        </div>
      </div>
    )
}

export const MarksControlComponent = ({setYCoord, setEncoding}) => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])
    let yOptions = ['Score', ...keys]


    return(
        <div className="marksControl">
            <div>
                <CoordDrop options={['point', 'bar', 'line']} label={"marks"} setHandle={setEncoding} />
            </div>
            <div>
                <div>encoding</div>
                <div>
                    <CoordDrop options={yOptions} label={"x"} setHandle={setYCoord} />
                    {/* <CoordDrop options={selectedPredicate.features} label={"y"} /> */}
                </div>
            </div>
            <div>
                <CoordDrop options={selectedPredicate.features} label={"Filter by"} />
            </div>
        </div>
    )
}

const WhichPlot = ({encoding, xCoord, yCoord}) => {
    const [{categoricalFeatures, selectedPredicate}, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;
   
    if(encoding === null){
        if(categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1){
            return  <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool} />
        }else if(selectedPredicate.feature[0] === "Order-Date"){
            return <FeatureLinePlot xCoord={xCoord} yCoord={yCoord} />
        }else{
            return <FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/>
        }
    }else if(encoding === 'point'){
        return <FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/>
    }
    return (
        <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/>
    )
}

const CoordDrop = ({options, label, setHandle}) => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const [coord, setCoord] = useState('');

    const handleChange = (event) => {
        setCoord(event.target.value)
        setHandle(event.target.value);
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
