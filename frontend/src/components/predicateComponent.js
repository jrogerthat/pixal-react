import { DeleteButton, HideButton, InvertButton } from './predicateEditButtons';

/*
TODO: hook this up to actually create a predicate
*/
export default function PredicateComp({predicateData, setHighlightPred, predEditMode, hiddenPreds, setHiddenPreds}) {

    const features = Object.entries(predicateData.predicate)

    const isDate = function(date) {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    }

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

 

    return (
        <div className='pred-wrap'
            onMouseEnter={() => setHighlightPred(predicateData.id)}
            onMouseLeave={() => setHighlightPred(null)}
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
                    <HideButton predicateData={predicateData} hiddenPreds={hiddenPreds} setHiddenPreds={setHiddenPreds}/>

                  
                    </div>
                )
            }
           
        </div>
    );
}