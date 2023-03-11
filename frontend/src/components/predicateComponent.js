import axios from 'axios';
import { useContext } from 'react';
import { useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';
import { CopyButton, DeleteButton, HideButton, InvertButton } from './predicateEditButtons';

/*
TODO: hook this up to actually create a predicate
*/
export default function PredicateComp({predicateData}) {
 
    const features = Object.entries(predicateData.predicate.attribute_values)
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{editMode, selectedPredicate, hiddenPredicates}, dispatch] = useContext(DataContext);

    const featureValues = (data) => {

        let valArr = (Array.isArray(data)) ? data : Object.entries(data)[0][1];

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
        if(hiddenPredicates.length === 0 || hiddenPredicates.indexOf(predicateData.id) === -1){
            return 1
        }else{
            return .5
        }
    }

    let isSelected = () => {
        return (selectedPredicate && predicateData.id === selectedPredicate.predicate_id) ? predicateData.color : 'white';//'#e8e4e4e0';
    }

    let handleClick = () => {
        if(!editMode){
            axios.get(`/get_selected_data/${predicateData.id}/50/25`).then((data)=> {

                let predSel = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                predSel.predicate_info = predicateData;
                dispatch({type: "UPDATE_SELECTED_PREDICATE", predSel})
            })
        }
    }

    let handleHover = (d) => dispatch({type: "PREDICATE_HOVER", pred:d})
    
    return (
        <div className="pred-wrap"
            style={{
                opacity: isHidden(),
                border: `3px solid ${isSelected()}`
            }}
           
            onMouseEnter={() => editMode ? handleHover(predicateData.id) : null}
            onMouseLeave={() => editMode ? handleHover(null) : null}
            onClick={handleClick}
        >
            <div>
            <div style={{marginBottom:10, paddingBottom:5, borderBottom:"1px solid #d3d3d3"}}><span>Bayes Factor Score:</span><span>{predicateData.predicate.score}</span></div>
            {
                features.map((f, i)=> (
                    <div key={`f-${i+1}`}><span>{`${f[0]}: `}</span>
                        {featureValues(f[1])}
                    </div>
                ))
            }
            
            </div>
            {
                editMode && (
                    <div className="pred-edit-bar">
                    <InvertButton predicateData={predicateData} />
                    <DeleteButton predicateData={predicateData} />
                    <HideButton predicateData={predicateData} />
                    <CopyButton predicateData={predicateData} />
                    </div>
                )
            }
           
        </div>
    );
}