import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react'
import { useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';

/*
TODO: hook this up to actually create a predicate
*/
function AddPredBox({setAddPredMode}){

    const [newPred, setNewPred] = useState(null);
    const handleChange = (e) => setNewPred(e.target.value);
    const [, dispatch] = useContext(DataContext);

    const useHandleSubmit = () => {

        setNewPred(null);
        setAddPredMode(null);

        useGetAxiosAsync(`add_predicate?${newPred}`).then(data => {
            dispatch({type: "SET_PREDICATE_EXPLORE_DATA", predData: data.data.predicates, parentToChildDict: data.data.parent_dict, dataTypes: null, dataTypeRanges:null})
        })
    }

    return (
        <div className='add-pred-box'>
            <TextField
            id="filled-multiline-flexible"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            onChange={handleChange}
            />
            {newPred !== null && <Button
            onClick={useHandleSubmit}
            >Submit</Button>}
        </div>
    );
} 

export default AddPredBox