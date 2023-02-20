import { Button, TextField } from '@mui/material';

import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import DoNotDisturbTwoToneIcon from '@mui/icons-material/DoNotDisturbTwoTone';
import { useState } from 'react';

const HideButton = ({predicateData, hiddenPreds, setHiddenPreds}) => {
    const [hidden, setHidden] = useState(false);

    const handleHides = () => {
     
        if(hiddenPreds.length === 0 || hiddenPreds.indexOf(predicateData.id) === -1){
            setHiddenPreds(oldArray => [...oldArray, predicateData.id]);
            setHidden(true);
        }else{
            let newPreds = [...hiddenPreds].filter(f => f != predicateData.id);
            setHiddenPreds(newPreds);
            setHidden(false);
        }
    }

   

    return(
        <Button
        variant="outlined" 
        size="small"
        style={{
            borderRadius: 40,
            padding:0,
            marginRight: 5
        }}
        onClick={handleHides}
        >{
            hidden ? <VisibilityTwoToneIcon /> : <VisibilityOffTwoToneIcon />
        }
        </Button>
    )
}

const DeleteButton = () => {
    return(
        <Button 
        variant="outlined" 
        color="error" 
        size="small"
        style={{
            borderRadius: 40,
            padding:0,
            marginRight: 5
        }}
        ><DeleteForeverTwoToneIcon /></Button>
    )

}

const InvertButton = () => {
    return(
        <Button 
        variant="outlined" 
        color="error" 
        size="small"
        style={{
            borderRadius: 40,
            padding:0,
            marginRight: 5
        }}
        ><DoNotDisturbTwoToneIcon /></Button>
    )

}

export {HideButton, DeleteButton, InvertButton}