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
        color="primary" 
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

    const [negated, setNegated] = useState(0);

    const HandleClick = () => {
       
        negated === 0 ? setNegated(1) : setNegated(0);

        useGetAxiosAsync(`/edit_predicate/${predicateData.id}/${negated}`).then((data) => {
            let pred_dist = Object.entries(data.data).map(m => {
                return [m[0], m[1].dist]
              })
        
              let predData = {'pred_list': data.data, 'pred_dist': pred_dist}
              dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData})
        })
    }
    return(
        <Button 
        variant={negated === 0 ? "outlined" : "contained"} 
        color={negated === 0 ? "primary" : "error"} 
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