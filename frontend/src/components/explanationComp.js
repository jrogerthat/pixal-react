import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context"
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";

export const ExplanationComponent = () => {


    const [{selectedPredicate, yCoord, xCoord}, dispatch] = useContext(DataContext);
    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);

    let keys = Object.entries(selectedPredicate.attribute_data[selectedPredicate.feature[0]]);

    useEffect(() => {
        
        if(yCoord === 'Score'){
            setExplanation(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1])
        }else{
            setExplanation(selectedPredicate.attribute_data[selectedPredicate.feature[0]][yCoord][1])
        }
    }, [yCoord])

    return (
        <React.Fragment>
            {
                keys.map(k => (
                    <div 
                    key={k[0]}
                    style={{display:'flex', flexDirection:'row', marginBottom: 10, cursor:'pointer'}}
                    onClick={()=> dispatch({type: "UPDATE_SELECTED_PRED_X_Y", predSel: selectedPredicate, x: xCoord,  y: k[0]  })}
                    >
                        <div
                        id={`explan-${k[0]}`}
                        style={{marginRight:10, borderRadius:20, backgroundColor:'#f4efefe0', padding:3}}
                        ><WhichPlot yCoord={k[0]} /></div>
                        <div style={{padding:10, marginTop:10}}>
                        <span style={{marginRight: 5, fontWeight:700}}>{`X Axis: ${xCoord}`}</span>
                        <span style={{marginRight: 10}}>{"|"}</span>
                        <span style={{marginRight: 5, fontWeight:700}}>{`Y Axis: ${k[0]}`}</span>
                            {k[1][1].join(" ")}</div>
                    </div>
                ))
            }
        </React.Fragment>
    )
}


const WhichPlot = ({yCoord}) => {
    const [{categoricalFeatures, selectedPredicate, xCoord }, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;

    if(categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1){
        // setEncoding('bar')
        return  <FeatureBarPlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        categorical={categoricalBool} feature={selectedPredicate.feature[0]}
        explanBool={true} 
        pivotBool={false}
        navBool={false}
        />
    }else if(selectedPredicate.feature[0] === "Order-Date"){
        // setEncoding('line')
        return <FeatureLinePlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        explanBool={true}/>
    }else{
        // setEncoding('dot')
        return <FeatureDotPlot 
        xCoord={xCoord} 
        yCoord={yCoord} 
        categorical={categoricalBool} 
        explanBool={true}/>
    }
}