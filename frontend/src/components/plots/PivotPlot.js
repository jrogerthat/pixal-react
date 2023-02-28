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

export const  PivotPlot = ({xCoord, setXCoord}) => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const [encoding, setEncoding] = useState(null);
    // const [xCoord, setXCoord] = useState('Score');
    const [yCoord, setYCoord] = useState('');
    const [filterByArray, setFilterByArray] = useState([]);
    const divRef = useRef();
  
    return (
        <div className="r-top">
        <MarksControlComponent 
            setEncoding={setEncoding} 
            setXCoord={setXCoord} 
            setYCoord={setYCoord} 
            setFilterByArray={setFilterByArray}
        />
        <div ref={divRef}>
            <div>plot</div>
           <WhichPlot xCoord={xCoord} encoding={encoding} />
           <div className="bookmark-button">
            <Button
            onClick={() => console.log('button')}
            >Bookmark Plot</Button>
            </div>
        </div>
      </div>
    )
}

export const MarksControlComponent = ({setXCoord, setEncoding}) => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])
    let xOptions = ['Score', ...keys]


    return(
        <div className="marksControl">
            <div>
                <CoordDrop options={['point', 'bar', 'line']} label={"marks"} setHandle={setEncoding} />
            </div>
            <div>
                <div>encoding</div>
                <div>
                    <CoordDrop options={xOptions} label={"x"} setHandle={setXCoord} />
                    {/* <CoordDrop options={selectedPredicate.features} label={"y"} /> */}
                </div>
            </div>
            <div>
                <CoordDrop options={selectedPredicate.features} label={"Filter by"} />
            </div>
        </div>
    )
}

const WhichPlot = ({encoding, xCoord}) => {
    const [{categoricalFeatures, selectedPredicate}, dispatch] = useContext(DataContext);

    if(encoding === null){
        if(categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1){
            return  <FeatureBarPlot selectedParam={xCoord} />
        }else{
            return <FeatureDotPlot selectedParam={xCoord} />
        }
    }else if(encoding === 'point'){
        return <FeatureDotPlot selectedParam={xCoord} />
    }
    return (
        <FeatureBarPlot selectedParam={xCoord} />
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
