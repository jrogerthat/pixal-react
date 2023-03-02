import { Button } from "@mui/material";
import { Fragment, useContext } from "react"
import { DataContext } from "../context";
import ScatterPlotTwoToneIcon from '@mui/icons-material/ScatterPlotTwoTone';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import PollTwoToneIcon from '@mui/icons-material/PollTwoTone';


export const BookmarkedPlots = () => {
    const [{bookmarkedPlots}, dispatch] = useContext(DataContext);

    const PlotIcon = ({encoding}) => {
        if(encoding === 'bar'){
            return <PollTwoToneIcon />
        }else if(encoding === 'point'){
            return <ScatterPlotTwoToneIcon />
        }
        return <ShowChartTwoToneIcon />
    }

    const ParseBookmark = ({book}) => {
        
        return (
            <Fragment>
                <span
                style={{marginRight: 20, fontWeight:700}}>
                    <PlotIcon encoding={book.encoding}/>
                </span>
                <span style={{marginRight: 5, fontWeight:700}}>X Axis:</span>
                <span style={{marginRight: 10}}>{book.x}</span>
                <span style={{marginRight: 5, fontWeight:700}}>Y Axis:</span>
                <span style={{marginRight: 10}}>{book.y}</span>
            </Fragment>
        )
    }

    return(
        <div>{
            bookmarkedPlots.map((b, i)=> (
                <div key={`book-${i}`}><Button 
                onClick={() => {
                    console.log(b)
                    dispatch({type:"UPDATE_SELECTED_PREDICATE", predSel: b.selectedPredicate})
                }}
                ><ParseBookmark book={b} /></Button></div>
            ))
        }</div>
    )
}