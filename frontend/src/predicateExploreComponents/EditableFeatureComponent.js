import { useContext, useMemo, useState } from 'react';
import { useGetAxiosAsync } from '../axiosUtil';
import { DataContext } from '../context';
import Slider from '@mui/material/Slider';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Button, Typography } from '@mui/material';
import { BasicDatePickerComp } from './DatePickerComponent';
import styled from '@emotion/styled';


export const EditableFeatureCompWrap = ({presentFeatureArray, predicateData}) => {
  const [{dataTypes, numericalDict}, dispatch] = useContext(DataContext);
  const [featureArray, setFeatureArray] = useState(presentFeatureArray);

  const combinedFeatureArraySorted = useMemo(() => {
    let combinedFeatureArrayFirst = Object.entries(dataTypes).map((dt, i) => {
      let isPresent = featureArray.map(p => p[0]).indexOf(dt[0]);
      return {feature: dt[0], data_type:dt[1], presentFeat: isPresent > -1 ? featureArray[isPresent] : null}
    });
  
    return [...combinedFeatureArrayFirst.filter(f => f.presentFeat != null), ...combinedFeatureArrayFirst.filter(f => f.presentFeat == null)]
    
  }, [featureArray]);
  
  return(
    <div style={{paddingLeft:5}}>{
    combinedFeatureArraySorted.map((f, i)=> {
      return(
      f.presentFeat === null ? <div style={{display:'inline'}}>
        <Button 
          onClick={() => {
            let values = f.data_type == 'nominal' ? [] : numericalDict[f.feature];
            setFeatureArray([...featureArray, [f.feature, values]]);
          }}
          variant="outlined" 
          size='small' 
          style={{margin:3}}>{`Add ${f.feature}`}</Button>
      </div> : <EditableFeatureComponent key={`f-${i+1}`} data={f} predData={predicateData}/>
    )})}</div>
  )
}

const DropCheckComponent = ({cat, selected, options, predData}) => {
  
    let [selectedNames, setSelectedNames] = useState(selected);
    let [pred, setPred] = useState(predData.predicate.attribute_values);
    const [{}, dispatch] = useContext(DataContext);

    const useHandleChange = (event) => {
        const {
        target: { value },
        } = event;
        
        let newSelected = selectedNames.indexOf(value) > -1 ? [...selectedNames].filter(f => f != value) : [...selectedNames, value];
        setSelectedNames(newSelected);

        let newPred = {...pred};
        newPred[cat]  = newSelected;
        let pass = {features: newPred, id: predData.id}

        useGetAxiosAsync(`edit_predicate_clause?${JSON.stringify(pass)}`).then(data => {
            dispatch({type: "SET_PREDICATE_EXPLORE_DATA", predData: data.data, parentToChildDict: null})
        })
  };
    return (
        <div>
        <FormControl sx={{ m: 1, width: "96%", marginBottom:.5 }} size="small">
          <InputLabel id="demo-multiple-checkbox-label" style={{fontSize:22, fontWeight:800}}>{cat}</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedNames}
            // onChange={useHandleChange}
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
                  onChange={useHandleChange}
                />
                <ListItemText primary={variant} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
}

const RangeDivStyled = styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
`
export const RangeSlider = ({range, data, predData}) => {
  const [, dispatch] = useContext(DataContext);
  const [value, setValue] = useState(data[1]);
  const [pred, setPred] = useState(predData.predicate.attribute_values);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    let test = {...predData.predicate.attribute_values}
    test[data[0]] = newValue;
    setPred(test);
  };

  const useMouseUp = () => {
    let pass = {features: pred, id: predData.id}
    useGetAxiosAsync(`edit_predicate_clause?${JSON.stringify(pass)}`).then(data => {
        dispatch({type: "SET_PREDICATE_EXPLORE_DATA", predData: data.data, parentToChildDict: null})
    })
  }

  return (
    <RangeDivStyled style={{width:300}}>
      <span
      style={{fontSize:11, paddingRight:4}}
      >{range[0]}</span>
      <Slider
        getAriaLabel={() => data[0]}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        size="small"
        aria-label="Small"
        min={range[0]}
        max={range[1]}
        // disabled={true}
        // marks={marks}
        onMouseUp={useMouseUp}
      />
    <span
    style={{fontSize:11, paddingLeft:4}}
    >{range[1]}</span>
    </RangeDivStyled>
  );
}

export default function EditableFeatureComponent({data, predData}){

    const [{categoryDict, numericalDict}] = useContext(DataContext);

    if(data.data_type === 'numeric'){
      return <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
      <Typography id="input-slider" gutterBottom style={{fontWeight:800, color:'gray'}}>
      {`${data.feature}: `}
      </Typography>
      <RangeSlider range={numericalDict[data.feature]} data={data.presentFeat} predData={predData}/>
      </div>
    }else if(data.data_type === 'nominal'){
      return <div>
      <DropCheckComponent cat={data.feature} selected={data.presentFeat[1]} options={categoryDict[data.feature]} predData={predData}/>
      </div>
    }

    // return <div style={{display:'inline'}}><span>{`${data[0]}: `}</span>
    // <div style={{display:'inline'}}>{`${data[1][0]} to ${data[1][1]}`}</div>
    // </div>
    // return <DateTimePickerValue />
    return <BasicDatePickerComp predData={predData} label={data.feature} dateRange={data.presentFeat[1]}/>
}