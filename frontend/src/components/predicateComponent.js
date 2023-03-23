import axios from 'axios';
import { useContext, useState } from 'react';
import { useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';
import { CopyButton, DeleteButton, HideButton, InvertButton } from './predicateEditButtons';
import Slider from '@mui/material/Slider';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import DateRangePickerComp from './DatePickerComponent';
import { Typography } from '@mui/material';




const DropCheckComponent = ({cat, selected, options, predData}) => {
  
    let [selectedNames, setSelectedNames] = useState(selected);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        console.log('ON CLICK', value);

        let newSelected = selectedNames.indexOf(value) > -1 ? [...selectedNames].filter(f => f != value) : [...selectedNames, value];
        setSelectedNames(newSelected);
        
  };
    return (
        <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label" style={{fontSize:22, fontWeight:800}}>{cat}</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedNames}
            // onChange={handleChange}
            input={<OutlinedInput label={cat} />}
            renderValue={(selectedNames) => selectedNames.map((x) => x).join(', ')}
            // MenuProps={MenuProps}
          >
            {options.map((variant, i) => (
              <MenuItem key={`${i}-v`} value={variant}>
                <Checkbox
                  checked={
                    selectedNames.indexOf(variant) > -1
                  }
                  value={variant}
                  onChange={handleChange}
                />
                <ListItemText primary={variant} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
}

const RangeSlider = ({range, data}) => {

  const [value, setValue] = useState(data[1]);

  const marks = [
    {
      value: range[0],
      label: range[0],
    },
    {
      value: range[1],
      label: range[1],
    }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: 300, display:'inline' }}>
      <Slider
        getAriaLabel={() => data[0]}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={""}
        min={range[0]}
        max={range[1]}
        marks={marks}
      />
    </div>
  );
}



const StaticClauseComponent = ({data}) => {
    return <div><span>{`${data[0]}: `}</span>
    {staticFeatureValues(data[1])}
    </div>
}

const EditableFeatureComponent = ({data, predData}) => {

    const [{predicateArray, categoricalFeatures, categoryDict}] = useContext(DataContext);
    const numericalClauses = ['precipitation', 'temperature'];
    const numericalRanges = {precipitation: [0, 20], temperature: [-32, 80]}

    if(numericalClauses.indexOf(data[0]) > -1){
        return <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
        <Typography id="input-slider" gutterBottom style={{fontWeight:800, color:'gray'}}>
        {`${data[0]}: `}
        </Typography>
        <RangeSlider range={numericalRanges[data[0]]} data={data}/>
        </div>
    }else if(categoricalFeatures.indexOf(data[0]) > -1){
        
        return <div>
        <DropCheckComponent cat={data[0]} selected={data[1]}  options={categoryDict[data[0]]} predData={predData}/>
        </div>
    }

    return <div style={{display:'inline'}}><span>{`${data[0]}: `}</span>
    <div style={{display:'inline'}}>{`${data[1][0]} to ${data[1][1]}`}</div>
    </div>
}

const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));

const staticFeatureValues = (data) => {

    let valArr = (Array.isArray(data)) ? data : Object.entries(data)[0][1];

    if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){
        return <div className="feature-value">between<span>{` ${valArr[0]} `}</span>and<span>{` ${valArr[1]} `}
        </span></div>
    }else if(valArr.length === 1){
        return  <div className="feature-value">{` ${valArr[0]}`}</div>
    }

    return (
        <div className="feature-value" >{valArr.join(', ')}</div>
    )
}
/*
TODO: hook this up to actually create a predicate
*/
export default function PredicateComp({predicateData}) {
 
    const features = Object.entries(predicateData.predicate.attribute_values)
    
    const [{editMode, selectedPredicate, hiddenPredicates}, dispatch] = useContext(DataContext);

    let isHidden = () => {
        if(hiddenPredicates.length === 0 || hiddenPredicates.indexOf(predicateData.id) === -1){
            return 1
        }else{
            return .5
        }
    }

    let isSelected = () => {
        return (selectedPredicate && predicateData.id === selectedPredicate.predicate_id) ? predicateData.color : 'white';//'#e8e4e4e0';
    }

    let handleClick = () => {
        if(!editMode){
            axios.get(`/get_selected_data/${predicateData.id}/50/25`).then((data)=> {

                let predSel = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                predSel.predicate_info = predicateData;
                dispatch({type: "UPDATE_SELECTED_PREDICATE", predSel})
            })
        }
    }

    let handleHover = (d) => dispatch({type: "PREDICATE_HOVER", pred:d})
    
    return (
        <div className="pred-wrap"
            style={{
                opacity: isHidden(),
                border: `3px solid ${isSelected()}`,
                cursor: 'pointer'//(editMode === true) ? 'pointer' : null
            }}
            onMouseEnter={() => editMode ? handleHover(predicateData.id) : null}
            onMouseLeave={() => editMode ? handleHover(null) : null}
            onClick={handleClick}
        >
            <div>
                <div style={{marginBottom:10, paddingBottom:5, borderBottom:"1px solid #d3d3d3"}}>
                    <span>Bayes Factor Score:</span>
                    <span>{predicateData.predicate.score.toFixed(2)}</span>
                </div>
                {
                    features.map((f, i)=> (
                        editMode ? <EditableFeatureComponent key={`f-${i+1}`} data={f} predData={predicateData}/> : <StaticClauseComponent key={`f-${i+1}`} data={f}/>
                    ))
                }
            </div>
            {
                editMode && (
                    <div className="pred-edit-bar" 
                    style={{display:'flex', flexDirection:'row', height:30, justifyContent:'space-between'}}
                    >
                    <div style={{width:'fit-content'}}>
                    <InvertButton predicateData={predicateData} />
                    <DeleteButton predicateData={predicateData} />
                    <HideButton predicateData={predicateData} />
                    <CopyButton predicateData={predicateData} />
                    </div>
                    <div
                    style={{width:30}}
                    ><svg><rect width={20} height={20} fill={predicateData.color}/></svg></div>
                    </div>
                )
            }
           
        </div>
    );
}