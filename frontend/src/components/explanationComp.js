import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context"

export const ExplanationComponent = () => {


    const [{selectedPredicate, yCoord}] = useContext(DataContext);
    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);

    useEffect(() => {
        
        if(yCoord === 'Score'){
            setExplanation(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1])
        }else{
            setExplanation(selectedPredicate.attribute_data[selectedPredicate.feature[0]][yCoord][1])
        }
    }, [yCoord])

    return (
        <React.Fragment>
        <div style={{marginTop:10}}>{
            explanation.map((ex, i) => <span key={`${i}-ex`}>{` ${ex}`}</span>)
            }</div>
        </React.Fragment>
    )
}