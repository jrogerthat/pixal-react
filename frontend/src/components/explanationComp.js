import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context"
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";

export const ExplanationComponent = () => {


    const [{selectedPredicate, yCoord}] = useContext(DataContext);
    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);

    let keys = Object.entries(selectedPredicate.attribute_data[selectedPredicate.feature[0]]);

    console.log('KEYS', keys)

    useEffect(() => {
        
        if(yCoord === 'Score'){
            setExplanation(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1])
        }else{
            setExplanation(selectedPredicate.attribute_data[selectedPredicate.feature[0]][yCoord][1])
        }
    }, [yCoord])

    return (
        <React.Fragment>
        {/* <div style={{marginTop:10}}>{
            explanation.map((ex, i) => <span key={`${i}-ex`}>{` ${ex}`}</span>)
            }</div> */}
            {
                keys.map(k => (
                    <div>
                        <div><WhichPlot yCoord={k[0]} /></div>
                        <div>{k[1][1].join(" ")}</div>
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
        return  <FeatureBarPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool} feature={selectedPredicate.feature[0]} />
    }else if(selectedPredicate.feature[0] === "Order-Date"){
        // setEncoding('line')
        return <FeatureLinePlot xCoord={xCoord} yCoord={yCoord} />
    }else{
        // setEncoding('dot')
        return <FeatureDotPlot xCoord={xCoord} yCoord={yCoord} categorical={categoricalBool}/>
    }
}