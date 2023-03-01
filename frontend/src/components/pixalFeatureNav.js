import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../context";
import * as d3 from "d3";
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";


export const PixalFeatureNavWrap = ({classN}) => {
    const [{selectedPredicate, categoricalFeatures}, dispatch] = useContext(DataContext);

    let predicateFeatureArray = useMemo(()=> {
        return (selectedPredicate && selectedPredicate.attribute_data != null) ? Object.entries(selectedPredicate.attribute_data) : [];
      }, [selectedPredicate]);


    const handleClick = (d) => {
        console.log('USE CLICK', d)
        dispatch({type:'FEATURE_SELECTED', feature: d})
    }

    return(
        <div className={classN} id="feat-nav-wrap-left">
        <div>Feature Navigation</div>
        <div className="feat-nav-wrap">
        {
        predicateFeatureArray.map((f, i) => (
            <div
            className="feature-nav"
            key={`${f[0]}-${i}`}
            onClick={() => handleClick(f)}
            >
            <div style={{marginBottom:10}}>{`${f[0]} :`}{featureValues(categoricalFeatures, f)}</div>
            <PixalFeatureNav feature={f[0]} />
            </div>
        ))
        }
        </div>
    </div>)
}

const featureValues = (categoricalFeatures, valArr) => {
        
    if(categoricalFeatures.indexOf(valArr[0]) > -1){

        let arr = Object.entries(valArr[1]);
        let chosen = arr[0][1][0].filter(f => f.predicate === 1);
     
        return chosen[0][valArr[0]]
    }

    return ""
}

export const PixalFeatureNav = ({feature}) => {
    console.log('FEATURE', feature)
    const [{categoricalFeatures}, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(feature) > -1;

    if(categoricalBool){
        return <FeatureBarPlot xCoord={feature} yCoord={'Score'} categorical={categoricalBool} feature={feature} navBool={true} />
    }else if(feature === "Order-Date"){
        return <FeatureLinePlot xCoord={feature} yCoord={'Score'} navBool={true} />
    }else{
       return <FeatureDotPlot xCoord={feature} yCoord={'Score'} categorical={false} navBool={true} />
    }
     
}
