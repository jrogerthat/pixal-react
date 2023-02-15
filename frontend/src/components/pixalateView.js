import { useState } from 'react'
import axios from "axios";
import '../App.css';
import Button from '@mui/material/Button';

function Pixalate() {

  return (
    <div className="pixalate">
      
        <div class="l-top">score</div>
        <div class="r-top">marks</div>
        <div class="l-bottom">feature</div>
        <div class="r-bottom">explaination</div>
      
    </div>
  );
}

export default Pixalate;