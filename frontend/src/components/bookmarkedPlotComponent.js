import { Button } from "@mui/material";
import { useContext } from "react"
import { DataContext } from "../context";
import { FeatureBarPlot } from "./plots/featureBarPlot";
import { FeatureDotPlot } from "./plots/featureDotPlot";
import { FeatureLinePlot } from "./plots/featureLinePlot";

export const BookmarkedPlots = () => {
    const [{bookmarkedPlots}, dispatch] = useContext(DataContext);

    const ParseBookmark = ({book}) => {
        
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
                style={{display:'flex', flexDirection:'row', marginBottom: 10}}
                onClick={() => {
                    dispatch({type: "UPDATE_SELECTED_PRED_X_Y", predSel: b.selectedPredicate, x: b.x, y: b.y  })
                    // dispatch({type:"UPDATE_SELECTED_PREDICATE", predSel: b.selectedPredicate})
                }}
                ><ParseBookmark book={b} />
                <div style={{padding:10, marginTop:10}}>
                <span style={{marginRight: 5, fontWeight:700}}>{`X Axis: ${b.x}`}</span>
                <span style={{marginRight: 10}}>{"|"}</span>
                <span style={{marginRight: 5, fontWeight:700}}>{`Y Axis: ${b.y}`}</span>
                {/* <span style={{marginRight: 10}}>{b.y}</span> */}
                {b.explanation.join(' ')}
                <div><Button>Export Plot</Button></div>
                </div>
               
                </div>
            ))
        }</div>
    )
}

const WhichPlot = ({data}) => {
    const [{categoricalFeatures, selectedPredicate, dataTypes}, dispatch] = useContext(DataContext);

    console.log('DATATYPES IN WHICH PLOT',dataTypes)

    let categoricalBool = categoricalFeatures.indexOf(selectedPredicate.feature[0]) > -1;

    if(data.encoding === 'bar'){
        // setEncoding('bar')
        return  <FeatureBarPlot 
        xCoord={data.x} 
        yCoord={data.y} 
        categorical={categoricalBool} 
        feature={data.x} 
        navBool={false}
        explanBool={true} 
        pivotBool={false} 
        bookmarkData={data}
        />
    }else if(data.encoding === 'line'){
       
        return <FeatureLinePlot 
        xCoord={data.x} 
        yCoord={data.y} 
        explanBool={true}
        bookmarkData={data}
        />
    }else{
       
        return <FeatureDotPlot 
        xCoord={data.x} 
        yCoord={data.y} 
        categorical={categoricalBool} 
        explanBool={true}
        bookmarkData={data}
        />
    }
}