import { useContext, useEffect } from "react";
import { DataContext } from "../context";
import * as d3 from "d3";


export const PixalFeatureNav = ({feature}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    console.log("FEATURE", Object.entries(selectedPredicate.attribute_score_data)[1]);
    
    const featureValues = (valArr) => {
        if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){
            return <span>between{` ${valArr[0]} `}and{` ${valArr[1]} `}</span>
        }else if(valArr.length === 1){
            return  <span>{` ${valArr[0]}`}</span>
        }

        return (
            valArr.map((m, i)=> (
                <span key={`fv-${i+1}`}>{` ${m},`}</span>
            ))
        )
    }

    const handleClick = () => {
        dispatch({type:'FEATURE_SELECTED', feature})
    }

    let x = d3.scaleBand().domain(Object.entries(selectedPredicate.attribute_score_data)[1])
    

    useEffect(()=> {

    }, [selectedPredicate]);

    return(
        <div 
        className="feature-nav"
        onClick={handleClick}
        >
            <div>{`${feature[0]}: `}
            {/* {featureValues(feature[1])} */}
            </div>
            <div>CHART HERE</div>
        </div>
    )
}

const FeatureMeanPlot = (feature_data) => {
    
}

