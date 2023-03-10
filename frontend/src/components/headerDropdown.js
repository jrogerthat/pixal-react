import * as React from 'react';
import { useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataContext } from '../context';

export default function BasicDrop() {

  const [{editMode}, dispatch] = React.useContext(DataContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const options = [{display: 'Explore and Edit Predicates', bool: true},{display: 'Explore Explanations', bool: false}]


  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='header-drop'>
      <Button
        variant="outlined"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {options.filter(f => f.bool === editMode)[0].display}
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
            options.map((op, i)=> (
                <MenuItem 
                key={`op-${i+1}`}
                onClick={() => {
                    
                    dispatch({type: "UPDATE_EDIT_MODE", editMode:op.bool})
                    handleClose();
                }}
                >{op.display}</MenuItem>
            ))
        }
      </Menu>
    </div>
  );
}