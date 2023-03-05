import { Button } from "@mui/material";
import { Fragment, useContext } from "react"
import { DataContext } from "../context";
import ScatterPlotTwoToneIcon from '@mui/icons-material/ScatterPlotTwoTone';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import PollTwoToneIcon from '@mui/icons-material/PollTwoTone';
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";


export const BookmarkedPlots = () => {
    const [{bookmarkedPlots}, dispatch] = useContext(DataContext);

    const ParseBookmark = ({book}) => {
        console.log(book)
        return (
            <div>
                <div
                 style={{marginRight:10, borderRadius:20, backgroundColor:'#f4efefe0', padding:3, cursor:'pointer'}}
                ><WhichPlot data={book} /></div>
               
            </div>
        )
    }

    return(
        <div>{
            bookmarkedPlots.map((b, i)=> (
                <div key={`book-${i}`}
                style={{display:'flex', flexDirection:'row'}}
                onClick={() => {
                    dispatch({type: "UPDATE_SELECTED_PRED_X_Y", predSel: b.selectedPredicate, x: b.x, y: b.y  })
                    // dispatch({type:"UPDATE_SELECTED_PREDICATE", predSel: b.selectedPredicate})
                }}
                ><ParseBookmark book={b} />
                <div>
                <span style={{marginRight: 5, fontWeight:700}}>{`X Axis: ${b.x}`}</span>
                <span style={{marginRight: 10}}>{"|"}</span>
                <span style={{marginRight: 5, fontWeight:700}}>{`Y Axis: ${b.y}`}</span>
                {/* <span style={{marginRight: 10}}>{b.y}</span> */}
                {b.explanation.join(' ')}</div>
                </div>
            ))
        }</div>
    )
}

const WhichPlot = ({data}) => {
    const [{categoricalFeatures, selectedPredicate }, dispatch] = useContext(DataContext);

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;

    if(data.encoding === 'bar'){
        // setEncoding('bar')
        return  <FeatureBarPlot 
        xCoord={data.x} 
        yCoord={data.y} 
        categorical={categoricalBool} 
        feature={data.x} 
        explanBool={true} />
    }else if(data.encoding === 'line'){
        // setEncoding('line')
        return <FeatureLinePlot 
        xCoord={data.x} 
        yCoord={data.y} 
        explanBool={true}
        />
    }else{
        // setEncoding('dot')
        return <FeatureDotPlot 
        xCoord={data.x} 
        yCoord={data.y} 
        categorical={categoricalBool} 
        explanBool={true}/>
    }
}