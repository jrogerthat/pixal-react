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

const OtherLegend = ({data}) => {
    
    return <div><svg width={12} height={12} style={{backgroundColor: 'gray', marginRight:5}}/>
    <span style={{fontSize:11}}>{`Data points with `}</span>
    {
        data.map((o, i)=>(
            <div 
            key={o[0]}
            style={{
                display: i === 0 ? 'inline' : 'block',
                fontSize:11, 
                marginLeft: i > 0 ? 17 : 0}}
            >
                {`${o[0]}:`} <span style={{fontWeight:800}}>{`${o[1].join(', ')}`}</span>
            </div>
        ))
    }
    </div>
}

export const PixalFeatureNav = ({feature}) => {
   
    const [{categoricalFeatures, selectedPredicate}] = useContext(DataContext);
    let categoricalBool = categoricalFeatures.indexOf(feature) > -1;
    let others = Object.entries(selectedPredicate.predicate_info.predicate.attribute_values).filter(f=> f[0] !== feature);

    if(categoricalBool){
    
        return <div style={{display:'flex', flexDirection:'column', alignItems:"center", width:'95%', marginTop:15, marginBottom:15}}>
    
        <FeatureBarPlot 
            xCoord={feature} 
            yCoord={'Score'} 
            categorical={categoricalBool} 
            feature={feature} 
            navBool={true}
            pivotBool={false}
            explanBool={false}
        />

        <div style={{display:'flex', flexDirection:'column', alignContent:'center', wdith:'90%', marginLeft:'5%'}}>
            <div style={{justifyContent:"center"}}>
                <svg 
                width={12} 
                height={12} 
                style={{
                    backgroundColor: `${selectedPredicate.predicate_info.color}`, 
                    marginRight:5}} />
            <span style={{fontSize:11}}>{`Data points with ${feature}: `} 
            <span style={{fontWeight:800}}>{`${selectedPredicate.predicate_info.predicate.attribute_values[feature].join(', ')}`}</span>
            </span>
            </div>
           
                {
                    others.length > 0 ?  <OtherLegend data={others} /> : <div style={{display:'inline'}}>
                         <svg 
                        width={12} 
                        height={12} 
                        style={{
                        backgroundColor: `gray`, 
                        marginRight:5}} /><span style={{fontSize:11}}>All other data points.</span>
                    </div>
                }
                </div>
        </div>
    }else if(feature === "Order-Date"){
        return <div style={{display:'flex', flexDirection:'column', alignItems:"center", width:'95%', marginTop:15, marginBottom:15}}>
         <FeatureLinePlot xCoord={feature} yCoord={'Score'} navBool={true} />
         <div style={{display:'flex', flexDirection:'column', alignContent:'center', wdith:'90%', marginLeft:'5%'}}>
            <div>
               <svg 
               width={12} 
               height={12} 
               style={{backgroundColor: `${selectedPredicate.predicate_info.color}`, marginRight:5}} />
           <span style={{fontSize:11}}>{`Data points with ${feature}: `}
           <span style={{fontWeight:800}}>{`${selectedPredicate.predicate_info.predicate.attribute_values[feature].join(', ')}`}</span></span>
           </div>
           {
            others.length > 0 && (
                <OtherLegend data={others} />
            )
           }
         </div>
         </div>
    }else{
       return <div style={{display:'flex', flexDirection:'column', alignItems:"center", width:'95%', marginTop:15, marginBottom:15}}>
       <FeatureDotPlot xCoord={feature} yCoord={'Score'} categorical={false} navBool={true} />
       
       <div style={{display:'flex', flexDirection:'column', alignContent:'center', wdith:'90%', marginLeft:'5%'}}>
            <div>
               <svg 
               width={12} 
               height={12} 
               style={{backgroundColor: `${selectedPredicate.predicate_info.color}`, marginRight:5}} />
            <span 
            style={{fontSize:11}}>
                {`Data points with ${feature}: `}
                <span style={{fontWeight:800}}>{`${selectedPredicate.predicate_info.predicate.attribute_values[feature].join(', ')}`}
                </span></span>
           </div>
           {
            others.length > 0 && (
                <OtherLegend data={others} />
            )
           }
        </div>
       </div>
    }
}