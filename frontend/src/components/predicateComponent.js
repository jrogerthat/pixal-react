import axios from 'axios';
import { useContext, useState } from 'react';
import { DataContext } from '../context';
import { CopyButton, DeleteButton, HideButton, InvertButton, EditButton } from '../predicateExploreComponents/predicateEditButtons';
import { EditableFeatureCompWrap } from '../predicateExploreComponents/EditableFeatureComponent';
import * as d3 from 'd3'
import { Slider } from '@mui/material';
import { PredExplorePlot } from './plots/predExplorerPlot';

const StaticClauseComponent = ({data}) => {

    return <div
    style={{paddingLeft:10, display:'flex', flexDirection:'row', alignItems:'center'}}
    ><div style={{paddingRight:10}}><span>{`${data[0]}: `}</span></div>
    {StaticFeatureValues(data)}
    </div>
}

const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));

const StaticFeatureValues = (data) => {
    const [{dataTypeRanges, dataTypes}] = useContext(DataContext);

    let valArr = (Array.isArray(data[1])) ? data[1] : Object.entries(data[1])[0][1];

    if(dataTypes[data[0]] === 'nominal'){
      
        return <div className="feature-value" >{valArr.join(', ')} 
            <span style={{fontWeight:60, fontSize:12}}>{`(${valArr.length} out of ${dataTypeRanges[data[0]].length})`}</span></div>
     
    }else if(dataTypes[data[0]] === 'date'){ 
       
        return <div className="feature-value">between<span>{` ${valArr[0]} `}</span>and<span>{` ${valArr[1]} `}
        </span></div>

    }else if(valArr.length === 1){

        // return  <div className="feature-value">{` ${valArr[0]}`}<span style={{fontWeight:60, fontSize:12}}>{` (${valArr.length} out of ${categoryDict[data[0]].length})`}</span></div>
        <span>{"add back in"}</span>
    }else if(dataTypes[data[0]] === 'numeric'){
     
    // }else if(isNaN(valArr[0]) === false){
        return <div style={{marginTop:25, display:'flex', flexDirection:'row', width:'85%'}}> <span
        style={{fontSize:11, paddingRight:4}}
        >{dataTypeRanges[data[0]][0]}</span>
        <Slider
        //   getAriaLabel={() => data[0]}
        //  aria-label={getAriaLabel}
          value={valArr}
          valueLabelDisplay="on"
          size="small"
        //   aria-label="Small"
          min={dataTypeRanges[data[0]][0]}
          max={dataTypeRanges[data[0]][1]}
          disabled={true}
        />
      <span
      style={{fontSize:11, paddingLeft:4}}
      >{dataTypeRanges[data[0]][1]}</span></div>

    }

    return (
        <span>{'ERROR'}</span>
    )
}
/*
TODO: hook this up to actually create a predicate
*/
export default function PredicateComp({predicateData, scoreExtent, index}) {
   
    const features = Object.entries(predicateData.predicate.attribute_values)
    const [{predicateArray, editMode, plotMode, selectedPredicate, hiddenPredicates}, dispatch] = useContext(DataContext);
    const [editing, setEditing] = useState(false);

    let count_one = predicateData.predicate.dist.filter(f => f.predicate === false)
    let count = count_one.length > 0 ? count_one.map(m => m.counts).reduce((a, c)=> a + c) : [];
    let uncount_one = predicateData.predicate.dist.filter(f => f.predicate === false)
    let uncount = uncount_one.length  > 0 ? uncount_one.map(m => m.counts).reduce((a, c)=> a + c) : [];

    // let count = predicateData.predicate.dist.filter(f => f.predicate === true).map(m => m.counts).reduce((a, c)=> a + c);
    // let uncount = predicateData.predicate.dist.filter(f => f.predicate === false).map(m => m.counts).reduce((a, c)=> a + c);

    let opacityFunction = (pred) => {
        if(predicateData.children && predicateData.children.map(m => +m.id).includes(+pred.id) || 
        (predicateData.parent && +predicateData.parent === +pred.id) || +predicateData.id === +pred.id){
            return 1;
        }else{
            return (predicateData.children || (predicateData.children && predicateData.children.map(m => +m.id).includes(+pred.id))) ? .1 : .3
        }
        // fillOpacity: p.id === predicateData.id ? 1 : .3
    }

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
       if(!editing){
       
        axios.get(`http://127.0.0.1:5000/get_selected_data/${predicateData.id}`).then((data)=> {
            // axios.get(`/get_selected_data/${predicateData.id}/50/25`).then((data)=> {
            let predSel = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            predSel.predicate_info = predicateData;
            let startFeat = Object.entries(predSel.attribute_data)[0]
            dispatch({type: "UPDATE_SELECTED_PREDICATE", predSel})
            dispatch({type:'FEATURE_SELECTED', feature: startFeat})
        })
       }
    }

    let handleHover = (d) => dispatch({type: "PREDICATE_HOVER", pred:d})
    let bayesScale = d3.scaleLinear().domain(scoreExtent).range([25, 125])

    return (
        <div className="pred-wrap"
            style={{
                flex: '1 1 750px',
                opacity: isHidden(),
                border: `3px solid ${isSelected()}`,
                height: editing ? 'auto' : 245,
                cursor: 'pointer',
                justifyContent: 'space-between',
                display:'flex',
                flexDirection:'column'
            }}
            onMouseEnter={() => editMode && plotMode === 'overlap' ? handleHover(predicateData.id) : null}
            onMouseLeave={() => editMode && plotMode === 'overlap' ? handleHover(null) : null}
            onClick={handleClick}
        >
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
                paddingRight:15,
                paddingTop:5,
            }}>
                <div>
                    <span style={{fontWeight:500}}>{`${predicateData.id}  |  `}</span>
                    <span style={{fontWeight:100}}>{`${count} of ${count + uncount} Points  |  `}</span>
                </div>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{flexDirection:'column', fontSize:12, fontWeight:100, paddingRight:10}}>
                    <div>{`Average: ${d3.mean(predicateArray.map(p => p.predicate.score)).toFixed(2)}`}</div>
                    <div>{`Std Dev: ${d3.deviation(predicateArray.map(p => p.predicate.score)).toFixed(2)}`}</div>
                    </div>
                    <div style={{width:150, flexDirection:'column', justifyContent: 'center', display:'flex'}}>
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
                            <rect 
                            key={`${p.id}`} 
                            width={p.id === predicateData.id ? 4 : 3} 
                            height={35} 
                            x={bayesScale(p.predicate.score)} 
                            y={1}
                            style={{fill: p.id === predicateData.id ? p.color : 'gray', 
                            fillOpacity: opacityFunction(p)}} 
                            />)
                        }
                        </svg>
                    </div>
                <div style={{justifyContent:'center', display:'flex'}}>
                    <div>
                        <span style={{fontWeight:100, fontSize:13}}>{` Bayes Factor:`}</span>
                        <span>{`  ${predicateData.predicate.score.toFixed(2)}`}</span>
                    </div>
                </div>
                </div>
                </div>
            </div>
            <div style={{display: 'flex', flexDirection:'row'}}>
            <div
            style={{
                flex: '1 1 750px',
                width: selectedPredicate ? 600 : 800,
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between'
            }}
            >
            <div>
            {
                editing ? <EditableFeatureCompWrap presentFeatureArray={features} predicateData={predicateData} /> : 
                features.map((f, i)=> (<StaticClauseComponent key={`f-${i+1}`} data={f}/>))
            }
            {/* {
                editMode && (
                    <div className="predicate_wrapper"
                    style={{
                    backgroundColor:'red',
                    alignSelf: 'last baseline' 
                    }}>
                    <div className="pred-edit-bar" 
                    style={{display:'flex', 
                    flexDirection:'row', 
                    height:30, 
                    justifyContent:'space-between',
                    borderTop:".5px solid gray",
                    borderRadius: 5,
                    marginLeft:5,
                    
                    }}
                    >
                        <div className="button_wrap" style={{width:'fit-content'}}>
                            <InvertButton predicateData={predicateData} />
                            <DeleteButton predicateData={predicateData} />
                            <HideButton predicateData={predicateData} />
                            <CopyButton predicateData={predicateData} />
                            <EditButton predicateData={predicateData} setEditing={setEditing} editing={editing} />
                        </div>
                    </div>
                    </div>
                )
            } */}
            </div>
            {
                editMode && (
                    <div className="predicate_wrapper"
                    >
                    <div className="pred-edit-bar" 
                    style={{display:'flex', 
                    flexDirection:'row', 
                    height:30, 
                    justifyContent:'space-between',
                    borderTop:".5px solid gray",
                    borderRadius: 5,
                    marginLeft:5,
                    
                    }}
                    >
                        <div className="button_wrap" style={{width:'fit-content'}}>
                            <InvertButton predicateData={predicateData} />
                            <DeleteButton predicateData={predicateData} />
                            <HideButton predicateData={predicateData} />
                            <CopyButton predicateData={predicateData} />
                            <EditButton predicateData={predicateData} setEditing={setEditing} editing={editing} />
                        </div>
                    </div>
                    </div>
                )
            }
            </div>
            <div className="score_wrap">
            <PredExplorePlot width={selectedPredicate ? 310 : 400} height={160} marginX={35} marginY={10} singlePred={predicateData} />
            </div>
        
        </div>
        </div>
    );
}