import { Button } from '@mui/material';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import DoNotDisturbTwoToneIcon from '@mui/icons-material/DoNotDisturbTwoTone';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import EditOffTwoToneIcon from '@mui/icons-material/EditOffTwoTone';
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
const EditButton = ({predicateData}) => {

    const [editable, setEditable] = useState(false);
    
    function editChange(){
        console.log('predicate', predicateData)
        editable ? setEditable(false) : setEditable(true);
    }
    return (
    <Button
        variant="outlined" 
        size="small"
        style={{
            borderRadius: 40,
            padding:0,
            marginRight: 5
        }}
        onClick={editChange}
        >{
            editable ? <EditOffTwoToneIcon /> : <DriveFileRenameOutlineTwoToneIcon />
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
           
            dispatch({type: "SET_PREDICATE_EXPLORE_DATA", predData: data.data})
        })
    }
    
    const[{},dispatch] = useContext(DataContext);

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
    const [{negatedArray}, dispatch] = useContext(DataContext);

    let negatedBool = negatedArray.indexOf(predicateData.id) > -1;
   
    const HandleClick = () => {

        let newNegated = negatedBool ? negatedArray.filter(n => n !== predicateData.id) : [...negatedArray, predicateData.id];

        dispatch({ type: "UPDATE_NEGATED", negated: newNegated})
       
        let negated = negatedBool ? 1 : 0;

        useGetAxiosAsync(`/edit_predicate/${predicateData.id}/${negated}`).then((data) => {

              dispatch({ type: "SET_PREDICATE_EXPLORE_DATA", predData: data.data})
        })
    }
    return(
        <Button 
        variant={!negatedBool ? "outlined" : "contained"} 
        color={!negatedBool ? "primary" : "error"} 
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

export {HideButton, DeleteButton, InvertButton, CopyButton, EditButton}