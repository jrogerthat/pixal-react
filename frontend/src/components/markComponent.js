import * as React from 'react';
import { useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataContext } from '../context';

export const MarksControlComponent = () => {

    const [{selectedPredicate}, dispatch] = React.useContext(DataContext);

    console.log('selected', selectedPredicate)


    return(
        <div className="marksControl">
            <div>
                <div>marks</div>
                <div></div>
            </div>
            <div>
                <div>encoding</div>
                <div></div>
            </div>
            <div>
                <div>filters</div>
                <MarkDropdown data={selectedPredicate.features} />
            </div>
        </div>
    )
}

const MarkDropdown = ({data}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    // const options = [{display: 'Explore and Edit Predicates', bool: true},{display: 'Explore Explanations', bool: false}]

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <div className='filter-drop'>
        <Button
            variant="outlined"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            Filter
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            {
                data.map((op, i)=> (
                    <MenuItem 
                    key={`op-${i+1}`}
                    onClick={() => {
                        // dispatch({type: "UPDATE_EDIT_MODE", editMode:op.bool})
                        handleClose();
                    }}
                    >{`filter by ${op}`}</MenuItem>
                ))
            }
        </Menu>
        </div>
    )
}