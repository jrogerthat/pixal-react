import axios from 'axios';
import { useContext } from 'react';
import { useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';
import { DeleteButton, HideButton, InvertButton } from './predicateEditButtons';

/*
TODO: hook this up to actually create a predicate
*/
export default function PredicateComp({predicateData, setHighlightPred, predEditMode, hiddenPreds, setHiddenPreds}) {
 
    const features = Object.entries(predicateData.predicate)
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [, dispatch] = useContext(DataContext);
    
    const featureValues = (valArr) => {
        if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){
            return <div className="feature-value">between<span>{` ${valArr[0]} `}</span>and<span>{` ${valArr[1]} `}
            </span></div>
        }else if(valArr.length === 1){
            return  <div className="feature-value">{` ${valArr[0]}`}</div>
        }

        return (
            valArr.map((m, i)=> (
                <div className="feature-value" key={`fv-${i+1}`}>{` ${m},`}</div>
            ))
        )
    }

    let isHidden = () => {
        if(hiddenPreds.length === 0 || hiddenPreds.indexOf(predicateData.id) === -1){
            return 1
        }else{
            return .5
        }
    }

    let handleClick = () => {
        if(!predEditMode){
            axios.get("/load_test_score").then((data)=> {
                let predSel = data.data;
                predSel.predicate_features = predicateData;
                dispatch({type: "UPDATE_SELECTED_PREDICATE", predSel})
            })
        }
    }

    return (
        <div className="pred-wrap"
            style={{opacity: isHidden()}}
           
            onMouseEnter={() => setHighlightPred(predicateData.id)}
            onMouseLeave={() => setHighlightPred(null)}
            onClick={handleClick}
        >
            {
                features.map((f, i)=> (
                    <div key={`f-${i+1}`}><span>{`${f[0]}: `}</span>
                        {featureValues(f[1])}
                    </div>
                ))
            }
            {
                predEditMode && (
                    <div className="pred-edit-bar">
                    <InvertButton />
                    {/* <ColorLensTwoToneIcon /> */}
                    <DeleteButton />
                    <HideButton 
                    predicateData={predicateData} 
                    hiddenPreds={hiddenPreds} 
                    setHiddenPreds={setHiddenPreds}/>

                    </div>
                )
            }
           
        </div>
    );
}