import { useContext, useEffect, useState } from "react"
import { DataContext } from "../context"

export const ExplanationComponent = ({xCoord}) => {

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    // console.log('selectedteddd',selectedPredicate.attribute_score_data[selectedPredicate.feature[0]]);
    // console.log('selectedteddd',selectedPredicate.feature[0]);

    const [explanation, setExplanation] = useState(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1]);

    useEffect(() => {
        console.log(xCoord);
        
        if(xCoord === 'Score'){
            // console.log(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]])
            setExplanation(selectedPredicate.attribute_score_data[selectedPredicate.feature[0]][1])
        }else{
            // console.log(selectedPredicate.attribute_data[selectedPredicate.feature[0]][xCoord][1]);
            setExplanation(selectedPredicate.attribute_data[selectedPredicate.feature[0]][xCoord][1])
        }
    }, [xCoord])

    return (
        <div style={{marginTop:10}}>{
            explanation.map((ex, i) => <span key={`${i}-ex`}>{` ${ex}`}</span>)
            }</div>
    )
}