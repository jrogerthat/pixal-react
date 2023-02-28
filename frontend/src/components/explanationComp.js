import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context"

export const ExplanationComponent = ({xCoord}) => {

    const [{selectedPredicate}] = useContext(DataContext);
    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);

    useEffect(() => {
        
        if(xCoord === 'Score'){
            setExplanation(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1])
        }else{
            setExplanation(selectedPredicate.attribute_data[selectedPredicate.feature[0]][xCoord][1])
        }
    }, [xCoord])

    return (
        <React.Fragment>
        <div style={{marginTop:10}}>{
            explanation.map((ex, i) => <span key={`${i}-ex`}>{` ${ex}`}</span>)
            }</div>
        </React.Fragment>
    )
}