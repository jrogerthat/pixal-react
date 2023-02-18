import { Button, TextField } from '@mui/material';
import { useState } from 'react'
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import DoNotDisturbTwoToneIcon from '@mui/icons-material/DoNotDisturbTwoTone';

/*
TODO: hook this up to actually create a predicate
*/
export default function EditablePredicate({predicateData, setHighlightPred}) {

    const features = Object.entries(predicateData[1])

    const isDate = function(date) {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    }

    const featureValues = (valArr) => {
       
        if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){
            return <div className="feature-value">between<span>{` ${valArr[0]} `}</span>and<span>{` ${valArr[1]} `}
            </span></div>
        }else if(valArr.length == 1){
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
           onMouseEnter={() => setHighlightPred(predicateData[0])}
           onMouseLeave={() => setHighlightPred(null)}
        >
            {
                features.map((f, i)=> (
                    <div key={`f-${i+1}`}><span>{`${f[0]}: `}</span>
                        {featureValues(f[1])}
                    </div>
                ))
            }
            <div className="pred-edit-bar">
                <DoNotDisturbTwoToneIcon />
                <ColorLensTwoToneIcon />
                <VisibilityOffTwoToneIcon />
                <DeleteForeverTwoToneIcon />
            </div>
        </div>
    );
}