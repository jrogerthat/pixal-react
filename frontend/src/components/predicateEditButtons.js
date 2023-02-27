import { Button, TextField } from '@mui/material';

import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import DoNotDisturbTwoToneIcon from '@mui/icons-material/DoNotDisturbTwoTone';
import { useContext, useState } from 'react';
import { DataContext } from '../context';

const HideButton = ({predicateData}) => {
    const [hidden, setHidden] = useState(false);

    const [{hiddenPredicates}, dispatch] = useContext(DataContext);

    const handleHides = () => {
     
        if(hiddenPredicates.length === 0 || hiddenPredicates.indexOf(predicateData.id) === -1){
            let hidden = [...hiddenPredicates, predicateData.id]
            dispatch({type: "UPDATE_HIDDEN_PREDS", hidden})
            setHidden(true);
        }else{
            let hidden = [...hiddenPredicates].filter(f => f != predicateData.id);
            dispatch({type: "UPDATE_HIDDEN_PREDS", hidden})
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