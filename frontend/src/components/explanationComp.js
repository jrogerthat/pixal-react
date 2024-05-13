import * as d3 from "d3";
import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context"
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";

const FormatExplanation = ({featCat, k}) => {
    return(
        <div style={{padding:10, marginTop:10}}>
            <div>
                <span style={{marginRight: 5, fontWeight:700}}>{`X Axis: ${featCat}`}</span>
                <span style={{marginRight: 10}}>{"|"}</span>
                <span style={{marginRight: 5, fontWeight:700}}>{`Y Axis: ${k[0]}`}</span>
            </div>
            <ul style={{paddingLeft:12}}>
                {
                    k[1][1].map((m, i) => m !== "" ? <li key={`li-${i}`}>{m}</li> : "")
                }
            </ul>
            
            {/* {k[1][1].join(", ")} */}
        </div>
    )
}

const FeatureComp = ({features, featCat}) => {

    let keys = Object.entries(features);
    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);
    
    return (
        <React.Fragment>
            {
                keys.map(k => (
                    <div 
                    key={k[0]}
                    style={{display:'flex', flexDirection:'row', marginBottom: 10, cursor:'pointer'}}
                    onClick={()=> {
                        // dispatch({type: "UPDATE_SELECTED_PRED_X_Y", predSel: selectedPredicate, x: featCat,  y: k[0]  })
                        dispatch({type:'FEATURE_SELECTED', feature: [featCat, k]})
                    }}
                    >
                        <div
                        id={`explan-${k[0]}`}
                        style={{marginRight:10, borderRadius:10, backgroundColor:'#f4efefe0', padding:3}}
                        >
                            <WhichPlot yCoord={k[0]} xCoord={featCat} />
                        </div>
                        <FormatExplanation featCat={featCat} k={k} />
                    </div>
                ))
            }
        </React.Fragment>
    )
}

export const ExplanationComponent = () => {

    const [{selectedPredicate, yCoord, xCoord}, dispatch] = useContext(DataContext);
    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);
    let selectedPredFeat = Object.entries(selectedPredicate.attribute_data);

    useEffect(() => {
        
        if(yCoord === 'Score'){
            setExplanation(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1])
        }else{
            setExplanation(selectedPredicate.attribute_data[selectedPredicate.feature[0]][yCoord][1])
        }
    }, [yCoord])

    return (
        <div>
            {
                selectedPredFeat.map((p, i) => (
                    <div key={`pred-feat-${i}`}>
                        <div
                        style={{
                            paddingLeft:10,
                            // backgroundColor:'red',
                            color:'gray',
                            fontWeight:400,
                            fontSize:15,
                            paddingTop:10
                        }}
                        ><span style={{fontSize:21}}>{p[0].toLocaleUpperCase()}</span></div>
                        <FeatureComp features={p[1]} featCat={p[0]}/>
                    </div>
                ))
            }
        </div>
    )
}


const WhichPlot = ({yCoord, xCoord}) => {
    const [{categoricalFeatures, selectedPredicate }, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;

    const [width, setWidth] = useState(500);
    const [svgHeight, setSvgHeight] = useState(300);

    useEffect(() => {
        setWidth(d3.select('.r-bottom').node().getBoundingClientRect().width * .5)
    }, [d3.select('.r-bottom').empty()]);

    if(categoricalFeatures.indexOf(xCoord) > -1){
        // setEncoding('bar')
        return  <FeatureBarPlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        categorical={categoricalBool} 
        feature={selectedPredicate.feature[0]}
        explanBool={true} 
        pivotBool={false}
        width={width}
        svgHeight={svgHeight}
        />
    }else if(xCoord === "Order-Date"){
     
        return <FeatureLinePlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        explanBool={true}
        width={width}
        svgHeight={svgHeight}
        />
    }else{
       
        return <FeatureDotPlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        categorical={categoricalBool} 
        explanBool={true}
        width={width}
        svgHeight={svgHeight}
        />
    }
}