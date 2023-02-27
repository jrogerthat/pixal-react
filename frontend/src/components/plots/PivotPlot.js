import * as d3 from "d3";
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FeatureBarPlot } from "./featureBarPlot";
import { FeatureDotPlot } from "./featureDotPlot";

export const  PivotPlot = () => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const [encoding, setEncoding] = useState(null);
    const [xCoord, setXCoord] = useState('Score');
    const [yCoord, setYCoord] = useState('');
    const [filterByArray, setFilterByArray] = useState([]);
    const divRef = useRef();
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(200);

  

    useLayoutEffect(()=> {
        if(divRef.current){
            let tempW = window.getComputedStyle(divRef.current).width;
            setWidth(tempW.split('px')[0]);
            let tempH = window.getComputedStyle(divRef.current).height;
            setHeight(tempH.split('px')[0]);
        }
    }, [divRef])

    return (
        <div className="r-top">
        <MarksControlComponent 
            setEncoding={setEncoding} 
            setXCoord={setXCoord} 
            setYCoord={setYCoord} 
            setFilterByArray={setFilterByArray}
        />
        <div ref={divRef}>plot
           <WhichPlot xCoord={xCoord} width={width} height={height} encoding={encoding} />
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

const WhichPlot = ({encoding, xCoord, width, height}) => {
    const [{categoricalFeatures, selectedPredicate}, dispatch] = useContext(DataContext);

    if(encoding === null){
        if(categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1){
            return  <FeatureBarPlot selectedParam={xCoord} width={width} height={height} />
        }else{
            return <FeatureDotPlot selectedParam={xCoord} width={width} height={height}/>
        }
    }else if(encoding === 'point'){
        return <FeatureDotPlot selectedParam={xCoord} width={width} height={height}/>
    }
    return (
        <FeatureBarPlot selectedParam={xCoord} width={width} height={height} />
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
