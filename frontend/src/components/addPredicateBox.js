import { Button, TextField } from '@mui/material';
import { useState } from 'react'
import { addPredicate } from '../axiosUtil';

/*
TODO: hook this up to actually create a predicate
*/
export default function AddPredBox({setAddPredMode}) {

    const [newPred, setNewPred] = useState(null);

    const handleChange = (e) => setNewPred(e.target.value)

    const handleSubmit = () => {

        
        let formatted = {'pred': newPred}
        console.log(formatted);
        addPredicate(formatted, '/add_predicate');
        setNewPred(null);
        setAddPredMode(null);
        
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
            onClick={handleSubmit}
            >Submit</Button>}
        </div>
    );
} 