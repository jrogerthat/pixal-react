import { Button, TextField } from '@mui/material';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import { useEffect, useState } from 'react'
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import DoNotDisturbTwoToneIcon from '@mui/icons-material/DoNotDisturbTwoTone';

const HideButton = ({predicateData, hiddenPreds, setHiddenPreds}) => {
    
    const handleHides = () => {
       
        if(hiddenPreds.indexOf(predicateData.id) === -1){
            let newPreds = [...hiddenPreds].push(predicateData.id);
            setHiddenPreds(newPreds);
            console.log('add hide', hiddenPreds);
        }else{
            let newPreds = [...hiddenPreds].filter(f => f != predicateData.id);
            setHiddenPreds(newPreds);
            console.log('show pred', hiddenPreds);
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
        ><VisibilityOffTwoToneIcon />
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