import { Button, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react'
import { useAddPredicate, useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';
import formatPredicateArray from '../dataFormating';

/*
TODO: hook this up to actually create a predicate
*/
function AddPredBox({setAddPredMode}){

    const [newPred, setNewPred] = useState(null);
    const handleChange = (e) => setNewPred(e.target.value);
    const [, dispatch] = useContext(DataContext);

    const useHandleSubmit = () => {

        let formatted = {'pred': newPred}

        // let data = useAddPredicate(formatted)
        
        let testArray = {"0": {"Sub-Category": ["Tables"]}, "1": {"Sub-Category": ["Machines"]}}
        
        let newPredicate = formatPredicateArray(testArray)

        setNewPred(null);
        setAddPredMode(null);

        useGetAxiosAsync(`add_predicate?${newPred}`).then(data => {
            dispatch({type:"UPDATE_PREDICATE_ARRAY", predicateArray:data.data})
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