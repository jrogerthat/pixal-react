import * as React from 'react';
import { useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataContext } from '../context';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const MarksControlComponent = () => {

    const [{selectedPredicate}, dispatch] = React.useContext(DataContext);

   


    return(
        <div className="marksControl">
            <div>
                <CoordDrop options={['point', 'bar', 'line']} label={"marks"} />
            </div>
            <div>
                <div>encoding</div>
                <div>
                    <CoordDrop options={selectedPredicate.features} label={"x"} />
                    <CoordDrop options={selectedPredicate.features} label={"y"} />
                </div>
            </div>
            <div>
                <CoordDrop options={selectedPredicate.features} label={"Filter by"} />
            </div>
        </div>
    )
}

const CoordDrop = ({options, label}) => {

    const [{selectedPredicate}, dispatch] = React.useContext(DataContext);

    const [coord, setCoord] = React.useState('');

    const handleChange = (event) => {
        setCoord(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
        <InputLabel id="demo-select-small">{label}</InputLabel>
        <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={coord}
            label={label}
            onChange={handleChange}
        >{
            options.map(op => (
                <MenuItem key={op} value={op}>{op}</MenuItem>
            ))
        }
        </Select>
        </FormControl>
    );
  
}