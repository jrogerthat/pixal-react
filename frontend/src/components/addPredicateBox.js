import { Button, TextField } from '@mui/material';
import { useState } from 'react'

/*
TODO: hook this up to actually create a predicate
*/
export default function AddPredBox({setPredEditMode}) {

    const [newPred, setNewPred] = useState(null);

    const handleChange = (e) => setNewPred(e.target.value)

    const handleSubmit = () => {
        setNewPred(null);
        setPredEditMode(null);
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