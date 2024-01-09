import axios from 'axios';
import { useContext, useState } from 'react';
import { DataContext } from '../context';
import { CopyButton, DeleteButton, HideButton, InvertButton } from '../predicateExploreComponents/predicateEditButtons';
import EditableFeatureComponent from '../predicateExploreComponents/EditableFeatureComponent';
import * as d3 from 'd3'
import { Slider } from '@mui/material';

const StaticClauseComponent = ({data}) => {

    return <div
    style={{paddingLeft:10, display:'flex', flexDirection:'row', alignItems:'center'}}
    ><div style={{paddingRight:10}}><span>{`${data[0]}: `}</span></div>
    {staticFeatureValues(data)}
    </div>
}

const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));

const staticFeatureValues = (data) => {

    const numericalRanges = {precipitation: [0, 20], temperature: [-32, 80]}

    let valArr = (Array.isArray(data[1])) ? data[1] : Object.entries(data[1])[0][1];

    if(isDate(valArr[0]) && data[0] === 'Order-Date'){ 
        // if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){ 
        return <div className="feature-value">between<span>{` ${valArr[0]} `}</span>and<span>{` ${valArr[1]} `}
        </span></div>

    }else if(isNaN(valArr[0]) === false){
        return <div style={{marginTop:25, display:'flex', flexDirection:'row', width:'85%'}}> <span
        style={{fontSize:11, paddingRight:4}}
        >{numericalRanges[data[0]][0]}</span>
        <Slider
          getAriaLabel={() => data[0]}
          value={valArr}
          valueLabelDisplay="on"
          size="small"
          aria-label="Small"
          min={numericalRanges[data[0]][0]}
          max={numericalRanges[data[0]][1]}
          disabled={true}
        />
      <span
      style={{fontSize:11, paddingLeft:4}}
      >{numericalRanges[data[0]][1]}</span></div>
    }else if(valArr.length === 1){
        return  <div className="feature-value">{` ${valArr[0]}`}</div>
    }

    return (
        <div className="feature-value" >{valArr.join(', ')}</div>
    )
}
/*
TODO: hook this up to actually create a predicate
*/
export default function PredicateComp({predicateData, scoreExtent}) {
 
    const features = Object.entries(predicateData.predicate.attribute_values)
    const [{predicateArray, editMode, selectedPredicate, hiddenPredicates}, dispatch] = useContext(DataContext);

    let isHidden = () => {
        if(hiddenPredicates.length === 0 || hiddenPredicates.indexOf(predicateData.id) === -1){
            return 1
        }else{
            return .5
        }
    }

    let isSelected = () => {
        return (selectedPredicate && predicateData.id === selectedPredicate.predicate_id) ? predicateData.color : 'white';//'#e8e4e4e0';
    }

    let handleClick = () => {
        if(!editMode){
            axios.get(`/get_selected_data/${predicateData.id}/50/25`).then((data)=> {

                let predSel = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                predSel.predicate_info = predicateData;
                dispatch({type: "UPDATE_SELECTED_PREDICATE", predSel})
            })
        }
    }

    let handleHover = (d) => dispatch({type: "PREDICATE_HOVER", pred:d})

    let bayesScale = d3.scaleLinear().domain(scoreExtent).range([25, 125])
    
    return (
        <div className="pred-wrap"
            style={{
                opacity: isHidden(),
                border: `3px solid ${isSelected()}`,
                cursor: 'pointer'//(editMode === true) ? 'pointer' : null
            }}
            onMouseEnter={() => editMode ? handleHover(predicateData.id) : null}
            onMouseLeave={() => editMode ? handleHover(null) : null}
            onClick={handleClick}
        >
            <div>
                <div style={{
                    marginBottom:10, 
                    paddingBottom:10, 
                    borderBottom:"1px solid #d3d3d3",
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'space-between',
                    gap:10,
                    alignItems:'stretch',
                    paddingLeft:12,
                    paddingTop:5
                    }}>
                    {/* <div style={{float:'right'}}> */}
                    <div>
                    <span>Bayes Factor Score:</span>
                    <span>{`  ${predicateData.predicate.score.toFixed(2)}`}</span>
                    </div>
                    <div style={{display:'inline', 
                    width:150, 
                    backgroundColor:'rgba(244, 239, 239, 0.78)', 
                    fillOpacity:.5,
                    borderRadius:15, 
                    paddingTop:2}}>
                        <svg
                    style={{height: 20, width:'100%'}}
                    >{
                        predicateArray.map((p)=> 
                        <rect id={`${p.id}`} 
                        width={p.id === predicateData.id ? 4 : 3} 
                        height={35} 
                        x={bayesScale(p.predicate.score)} 
                        y={1}
                        style={{fill:p.id === predicateData.id ? p.color : 'gray', fillOpacity: p.id === predicateData.id ? 1 : .3}} 
                        />)
                    }
                    </svg></div>
                    
                </div>
                {
                    features.map((f, i)=> (
                        editMode ? <EditableFeatureComponent key={`f-${i+1}`} data={f} predData={predicateData}/> : 
                        <StaticClauseComponent key={`f-${i+1}`} data={f}/>
                    ))
                }
            </div>
            {
                editMode && (
                    <div className="pred-edit-bar" 
                    style={{display:'flex', 
                    flexDirection:'row', 
                    height:30, 
                    justifyContent:'space-between',
                    borderTop:".5px solid gray",
                    borderRadius: 5,
                    // backgroundColor:'#eeeeee',
                    marginTop:20,
                    paddingTop:10,
                    marginLeft:5
                }}
                    >
                    <div style={{width:'fit-content'}}>
                    <InvertButton predicateData={predicateData} />
                    <DeleteButton predicateData={predicateData} />
                    <HideButton predicateData={predicateData} />
                    <CopyButton predicateData={predicateData} />
                    </div>
                    <div
                    style={{width:30}}
                    ><svg><rect width={20} height={20} fill={predicateData.color}/></svg></div>
                    </div>
                )
            }
           
        </div>
    );
}