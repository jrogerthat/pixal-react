import { useState } from 'react'
import axios from "axios";
import '../App.css';
import Button from '@mui/material/Button';

function PredicateNav({predEditMode, setPredEditMode}) {

  return (
    <div className="pred-exp-nav">
      <Button
      onClick={()=> predEditMode ? setPredEditMode(false) : setPredEditMode(true)}
      >{predEditMode ? "Explore Predicate Explanations" : "Explore Predicate Explorer"}</Button>
    </div>
  );
}

export default PredicateNav;