import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FeatureBarPlot } from "./featureBarPlot";

export const  PivotPlot = () => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    console.log('sel p',selectedPredicate);

    const [encoding, setEncoding] = useState('bar');
    const [xCoord, setXCoord] = useState('Score');
    const [yCoord, setYCoord] = useState('');
    const [filterByArray, setFilterByArray] = useState([]);
   

    useEffect(()=> {

    }, [encoding, xCoord, yCoord, filterByArray]);

    return (
        <div className="r-top">
        <MarksControlComponent 
        setEncoding={setEncoding} 
        setXCoord={setXCoord} 
        setYCoord={setYCoord} 
        setFilterByArray={setFilterByArray}
        />
        <div>plot

            <FeatureBarPlot selectedParam={xCoord} width={300} height={200} />
        </div>
      </div>
    )

}


export const MarksControlComponent = ({setXCoord}) => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    console.log('FEAT', selectedPredicate.feature[0])

    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])

  
    let xOptions = ['Score', ...keys]
    
    console.log('KEYS', xOptions);

    return(
        <div className="marksControl">
            <div>
                <CoordDrop options={['point', 'bar', 'line']} label={"marks"} />
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
