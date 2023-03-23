import { useContext, useMemo } from "react";
import { DataContext } from "../context";
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";


export const PixalFeatureNavWrap = ({classN}) => {
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    let predicateFeatureArray = useMemo(()=> {
        return (selectedPredicate && selectedPredicate.attribute_data != null) ? Object.entries(selectedPredicate.attribute_data) : [];
      }, [selectedPredicate]);

    const handleClick = (d) => {
        dispatch({type:'FEATURE_SELECTED', feature: d})
    }

    return(
        <div className={classN} id="feat-nav-wrap-left">
        <div className="head-3">Feature Navigation</div>
        <div className="feat-nav-wrap">
        {
        predicateFeatureArray.map((f, i) => (
            <div
            className="feature-nav"
            key={`${f[0]}-${i}`}
            onClick={() => handleClick(f)}
            style={{
                // alignItems:"center", 
                display:'flex', 
                flexDirection:'column'
            }}
            >
            {/* <div style={{marginBottom:10}}>{`${f[0]}: `}{selectedPredicate.predicate_info.predicate.attribute_values[f[0]].join(', ')}</div> */}
            <PixalFeatureNav feature={f[0]} />
            </div>
        ))
        }
        </div>
    </div>)
}

export const PixalFeatureNav = ({feature}) => {
   
    const [{categoricalFeatures, selectedPredicate}] = useContext(DataContext);
    let categoricalBool = categoricalFeatures.indexOf(feature) > -1;

    if(categoricalBool){
        console.log('feature', selectedPredicate.predicate_info.predicate.attribute_values);
        // console.log(selectedPredicate.predicate_info.predicate.attribute_values[feature].join(', '))
        return <div style={{display:'flex', flexDirection:'column'}}>
          <div>
            <div><svg width={12} height={12} style={{backgroundColor: `${selectedPredicate.predicate_info.color}`}}/>
            <span style={{fontSize:11}}>{`data points with ${feature} : ${feature}`}</span>
            </div>
          </div>
           
        <FeatureBarPlot xCoord={feature} yCoord={'Score'} categorical={categoricalBool} feature={feature} navBool={true} />
        </div>
    }else if(feature === "Order-Date"){
        return <FeatureLinePlot xCoord={feature} yCoord={'Score'} navBool={true} />
    }else{
       return <FeatureDotPlot xCoord={feature} yCoord={'Score'} categorical={false} navBool={true} />
    }
}