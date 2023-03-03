import { Button, TextField } from '@mui/material';

import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import DoNotDisturbTwoToneIcon from '@mui/icons-material/DoNotDisturbTwoTone';
import { useContext, useState } from 'react';
import { DataContext } from '../context';
import { useGetAxiosAsync } from '../axiosUtil';

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

const DeleteButton = ({predicateData}) => {
    const [{deletedPredicates}, dispatch] = useContext(DataContext);
    const HandleDelete = () => {
        let deleted = [...deletedPredicates, predicateData.id]
        dispatch({type: "DELETE_PREDICATE", deleted})
    }
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
        onClick={HandleDelete}
        ><DeleteForeverTwoToneIcon /></Button>
    )

}



const CopyButton = ({predicateData}) => {
    
    const HandleCopy = () => {
        useGetAxiosAsync(`copy_predicate/${predicateData.id}`).then(data => {
            dispatch({type: "UPDATE_PREDICATE_ARRAY", predicateArray: data.data})
        })
    }
    
    const[{predicateArray},dispatch] = useContext(DataContext);

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
        onClick={HandleCopy}
        ><FileCopyTwoToneIcon /></Button>
    )
}

const InvertButton = ({predicateData}) => {
    const [{}, dispatch] = useContext(DataContext);
    const HandleClick = () => {
        console.log(predicateData)
        useGetAxiosAsync("/edit_predicate/0/1").then((d) => {
            // dispatch({type:"", })
        })
    }
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
        onClick={HandleClick}
        ><DoNotDisturbTwoToneIcon /></Button>
    )

}

export {HideButton, DeleteButton, InvertButton, CopyButton}