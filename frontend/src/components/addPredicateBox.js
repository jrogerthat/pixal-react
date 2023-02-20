import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react'
import { useAddPredicate } from '../axiosUtil';
import formatPredicateArray from '../dataFormating';



/*
TODO: hook this up to actually create a predicate
*/
function AddPredBox({setAddPredMode, setPredicateArray}){

    const [newPred, setNewPred] = useState(null);
    const handleChange = (e) => setNewPred(e.target.value);

    const useHandleSubmit = () => {

        let formatted = {'pred': newPred}
       
        // let data = useAddPredicate(formatted)
        
        // console.log("WOKRING ?", data)
        
        let testArray = {"0": {"Sub-Category": ["Tables"]}, "1": {"Sub-Category": ["Machines"]}}
        
        let shift = formatPredicateArray(testArray)

        setNewPred(null);
        setAddPredMode(null);
        setPredicateArray(shift);
        
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