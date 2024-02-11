import * as d3 from "d3";
import { useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../../context";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FeatureBarPlot } from "./featureBarPlot";
import { FeatureDotPlot } from "./featureDotPlot";
import { Button, FormControlLabel, FormGroup, Switch, ToggleButton } from "@mui/material";
import { FeatureLinePlot } from "./featureLinePlot";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

export const  PivotPlot = () => {

    const [{selectedPredicate, xCoord, yCoord, plotStyle}, dispatch] = useContext(DataContext);
    const [encoding, setEncoding] = useState(null);
    const [checked, setChecked] = useState(true);
    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])
    let yOptions = ['Score', ...keys]
    let others = Object.entries(selectedPredicate.predicate_info.predicate.attribute_values).filter(f=> f[0] !== xCoord);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        dispatch({type: "CHANGE_SCALE", scaleExtent: event.target.checked})
    };

    return (
        <div className="r-top" style={{display:'flex', flexDirection:'row'}}>
        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', marginLeft:10}}>
            <div style={{
                marginTop:15,
                marginLeft:5,
                alignItems:'flex-end', 
                flexDirection:'column',
                display:'flex'}}>
                <Legend selectedPredicate={selectedPredicate} xCoord={xCoord}/>
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', paddingTop:50, marginLeft:10}}>
                    <div style={{position:'relative', left:25}}>
                        <CoordDrop 
                            options={yOptions} 
                            label={"y"} 
                            type={"yCoord"}
                        />
                    </div>
                    <div style={{fontSize:7, position:'relative', left:30}}>
                        <FormGroup>
                            <FormControlLabel 
                            control={<Switch size="small"defaultChecked />} 
                            onChange={handleChange}
                            style={{fontSize:7}}
                            label="Y Scale Extent" 
                            size="small"/>
                        </FormGroup>
                    </div>
                </div>
            </div>
            <div className="bookmark-button" 
                style={{
                    display: 'flex', 
                    flexDirection:'row', 
                    marginTop:7, 
                    justifyContent:'flex-start',
                    marginBottom:20,
                }}>
                    <Button
                    onClick={() => {
                        dispatch({type: "ADD_BOOKMARK_PLOT", 
                        bookmarked: {'x': xCoord, 'y': yCoord, 
                        'encoding': encoding, 
                        'selectedPredicate': {...selectedPredicate}, 
                        'color': selectedPredicate.predicate_info.color,
                        'feature': {...selectedPredicate.feature}, 
                        'explanation': getExplanation(xCoord, yCoord, selectedPredicate)}})}}
                    ><BookmarkAddIcon/>Bookmark Plot</Button>
            </div>
        </div>
        <div id="pivot-plot" style={{marginTop:5}}>
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
        
            <WhichPlot setEncoding={setEncoding} />
            </div>
            <div style={{display:"flex", justifyContent:'center'}}>
                <div style={{position:'relative', top: encoding === 'line' ? -35 : -15}}>
                    <CoordDropX  
                    options={selectedPredicate.predicate_info.predicate.attribute_values} 
                    label={"x"} 
                    type={"xCoord"}/>
                </div>
            
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

const Legend = ({selectedPredicate, xCoord, others}) => {
    return(
        <div>
        <div style={{display:'inline'}}>
            <svg width={12} height={12} style={{backgroundColor: `${selectedPredicate.predicate_info.color}`, marginRight:5}} />
            <div 
            style={{fontSize:13,
                    display:'inline'
            }}>
            {/* {`Data points with`}  */}
            <span style={{fontWeight:800}}>{`${xCoord}:`}</span></div>
            <div style={{fontSize:13, display:'inline'}}>
            {`${selectedPredicate.predicate_info.predicate.attribute_values[xCoord].join(', ')}`}
            </div>
        </div>
        <div style={{marginTop:5}}>
        <svg width={13} height={12} style={{backgroundColor: 'gray', marginRight:5, display:'inline'}}/>
        {/* </div> */}
        {
            others && others.length > 0 ? <div style={{display:'inline'}}>
            {
                 others.map((o, i) => (
                     <div 
                     key={o[0]}
                     style={{
                         fontSize:13, 
                         display:'inline'
                     }}
                     >
                         <span style={{fontWeight:800}}>{`${o[0]}`}</span>{`: ${o[1].join(', ')}`}
                     </div>
                 ))
             }
            </div> : <div style={{display:'inline'}}>
             <span style={{fontSize:13}}>All other data.</span>
         </div>
        }
        </div>
    </div>
    
    )
}

const WhichPlot = ({setEncoding}) => {
    const [{categoricalFeatures, selectedPredicate, xCoord, yCoord},] = useContext(DataContext);

  

    let categoricalBool = useMemo(() => {
        return categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;
    }, [selectedPredicate, selectedPredicate.feature])
    

    if(categoricalBool){
        setEncoding('bar')
        return  <div style={{marginTop:20}}>
            <FeatureBarPlot 
            xCoord={xCoord} 
            yCoord={yCoord} 
            categorical={categoricalBool} 
            feature={selectedPredicate.feature[0]} 
            pivotBool={true}
            explanBool={false}
            navBool={false}
            /></div>
    }else if(selectedPredicate.feature[0] === "Order-Date"){
        setEncoding('line')
        return <div style={{marginTop:20}}>
       <FeatureLinePlot xCoord={xCoord} yCoord={yCoord} /></div>
    }else{
        setEncoding('dot')
        return <div style={{marginTop:20}}>
       <FeatureDotPlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        categorical={categoricalBool}
        pivotBool={true}
        explanBool={false}
        navBool={false}
        /></div>
    }
}

const CoordDrop = ({options, label, type}) => {

    const [{xCoord, yCoord}, dispatch] = useContext(DataContext);

    const [coord, setCoord] = useState(type === "yCoord" ? "Score" : xCoord);

    useEffect(() => {
        
        type === "yCoord" ? setCoord(yCoord) : setCoord(xCoord);
    }, [yCoord, xCoord])

    const handleChange = (event) => {
        // setCoord(event.target.value)
        if(type === "yCoord"){
            dispatch({type: "UPDATE_AXIS", coords: {x: xCoord, y: event.target.value}})
        }else if(type === "xCoord"){
            // dispatch({type: "UPDATE_AXIS", coords: {x: event.target.value, y: yCoord}})
        }
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 90, p:.1 }} size="small">
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

const CoordDropX = ({options, label, type}) => {

    const [{xCoord, selectedPredicate}, dispatch] = useContext(DataContext);
    const [coord, setCoord] = useState(xCoord);

    useEffect(() => {
        setCoord(xCoord);
    }, [xCoord])

    const handleChange = (event) => {
        let feat = [event.target.value, selectedPredicate.attribute_data[event.target.value]]
        dispatch({type:'FEATURE_SELECTED', feature: feat})
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 90, p:.1 }} size="small">
        <InputLabel id="demo-select-small">{label}</InputLabel>
        <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={coord}
            label={label}
            onChange={handleChange}
        >{
            Object.entries(options).map(op => (
                <MenuItem key={op[0]} value={op[0]}>{op[0]}</MenuItem>
            ))
        }
        </Select>
        </FormControl>
    );
  
}
