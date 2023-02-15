import { useState } from 'react'
import axios from "axios";
import '../App.css';
import Button from '@mui/material/Button';

function Pixalate() {

  return (
    <div className="pixalate">
      
        <div className="l-top">score</div>
        <div className="r-top">marks</div>
        <div className="l-bottom">feature</div>
        <div className="r-bottom">explaination</div>
      
    </div>
  );
}

export default Pixalate;