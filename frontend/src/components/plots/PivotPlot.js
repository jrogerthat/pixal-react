import * as d3 from "d3";
import { useContext, useEffect, useMemo, useState } from "react";
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

    console.log('selected pred', selectedPredicate);
   
    return (
        <div className="r-top">
        <MarksControlComponent />
        <div id="pivot-plot" style={{display:'flex', flexDirection:'column'}}>
           <WhichPlot setEncoding={setEncoding} />
           <div className="bookmark-button" style={{marginTop:30}}>
            <Button
            onClick={() => {
                dispatch({type: "ADD_BOOKMARK_PLOT", 
                bookmarked: {'x': xCoord, 'y': yCoord, 
                'encoding': encoding, 
                'selectedPredicate': {...selectedPredicate}, 
                'feature': selectedPredicate.feature, 
                'explanation': getExplanation(xCoord, yCoord, selectedPredicate)}})}}
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

    const [{selectedPredicate, xCoord},] = useContext(DataContext);
    let keys = Object.keys(selectedPredicate.attribute_data[selectedPredicate.feature[0]])
    let yOptions = ['Score', ...keys]
    let others = Object.entries(selectedPredicate.predicate_info.predicate.attribute_values).filter(f=> f[0] !== xCoord);

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
            <div style={{marginTop:40}}>
                
                <div>
                <svg 
                width={12} 
                height={12} 
                style={{backgroundColor: `${selectedPredicate.predicate_info.color}`, marginRight:5}} />
                <div 
                style={{fontSize:13,
                        display:'inline'
                }}>
                    {`Data points with`} <span style={{fontWeight:800}}>{`${xCoord}:`}</span></div>
                <div style={{fontSize:13}}>
                    {`${selectedPredicate.predicate_info.predicate.attribute_values[xCoord].join(', ')}`}
                    </div>
                </div>
        
                <div style={{marginTop:10}}><svg width={13} height={12} style={{backgroundColor: 'gray', marginRight:5}}/>
                {
                    others.length > 0 ? <div>
                        {
                            others.map((o, i) => (
                                <div 
                                key={o[0]}
                                style={{
                                    fontSize:13, 
                                }}
                                >
                                    <span style={{fontWeight:800}}>{`${o[0]}`}</span>{`: ${o[1].join(', ')}`}
                                </div>
                            ))
                        }
                    </div> : <div style={{display:'inline'}}>
                        <span style={{fontSize:13}}>All other data points.</span>
                    </div>
                }
                   
                </div>
            </div>
        </div>
    )
}

// {
                    
//     <div style={{fontSize:13, display:'inline'}}>{`Data points with `}</div>
//     {
//     others.map((o, i)=>(
//         <div 
//         key={o[0]}
//         style={{
//             // display: i === 0 ? 'inline' : 'block',
//             fontSize:13, 
//             // marginLeft: i > 0 ? 17 : 0
//         }}
//         >
//             <span style={{fontWeight:800}}>{`${o[0]}`}</span>{`: ${o[1].join(', ')}`}
//         </div>
//     ))
// }

const FilterList = () => {
    const [{selectedPredicate, xCoord},] = useContext(DataContext);
    let rows = Object.entries(selectedPredicate.predicate_info.predicate.attribute_values);
    
    return (
        <div style={{marginTop:10, borderRadius:10, }}>
            <div
            style={{marginBottom:2, padding:5}}
            >Filtered by:</div>
            <div style={{display:'flex', flexDirection:'column'}}>
                {rows.map((row, i) => {
                return (
                    <div key={`fil-${i}`} 
                    style={{
                        // backgroundColor: row[0] === xCoord ? selectedPredicate.predicate_info.color : 'gray .2',
                        marginTop:10,
                        display:'flex', 
                        flexDirection:'row',
                        justifyContent:'space-between',
                        fontSize:11,
                        borderTop: ".5px solid gray"
                        }}>
                        <div
                        style={{
                            fontWeight:800, color: row[0] === xCoord ? selectedPredicate.predicate_info.color : 'gray'}}
                        >{`${row[0]}: `}</div>
                        <div
                        style={{textAlign:'right'}}
                        >{row[1].join(", ")}</div>
                    </div>
                )})}
            </div>

        </div>
        // <TableContainer component={Paper}>
        // <Table 
        // sx={{ backgroundColor: '#f4efefe0', fontSize: 8, width:200 }} 
        // aria-label="simple table">
        //     <TableHead>
        //     <TableRow>
        //         <TableCell>Filtered By:</TableCell>
        //     </TableRow>
        //     </TableHead>
        //     <TableBody>
        //     {rows.map((row, i) => {
        //         return (
        //         <TableRow
        //         key={`fil-${i}`}
        //         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        //         >
                    
        //         <TableCell component="th" scope="row">
        //         <span
        //         style={{color: xCoord === row[0] ? selectedPredicate.predicate_info.color : 'gray', fontWeight:700}}
        //         >{`${row[0]}: `}</span> 
        //         </TableCell>
        //         <TableCell align="right">{row[1].join(", ")}</TableCell>
                
        //         </TableRow>
        //     )})}
        //     </TableBody>
        // </Table>
        // </TableContainer>
    );
}

const WhichPlot = ({setEncoding}) => {
    const [{categoricalFeatures, selectedPredicate, xCoord, yCoord},] = useContext(DataContext);

    let categoricalBool = useMemo(() => {
        return categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;
    }, [selectedPredicate, selectedPredicate.feature])
    

    if(categoricalBool){
        setEncoding('bar')
        return  <div style={{marginTop:20}}>
            <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool} feature={selectedPredicate.feature[0]} /></div>
    }else if(selectedPredicate.feature[0] === "Order-Date"){
        setEncoding('line')
        return <div style={{marginTop:20}}>
       <FeatureLinePlot xCoord={xCoord} yCoord={yCoord} /></div>
    }else{
        setEncoding('dot')
        return <div style={{marginTop:20}}>
       <FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/></div>
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
