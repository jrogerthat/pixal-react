import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../context";
import * as d3 from "d3";


export const PixalFeatureNavWrap = ({classN, ref, predicateFeatureArray}) => {
    
    
    return(
        <div className={classN} ref={ref}>
        <div>Feature Navigation</div>
        <div className="feat-nav-wrap">
        {
        predicateFeatureArray.map(f => (
            <PixalFeatureNav key={`${f[0]}`} feature={f} />
        ))
        }
        </div>
    </div>)
}

export const PixalFeatureNav = ({feature}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate, categoricalFeatures}, dispatch] = useContext(DataContext);

    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(200);
    let [svgMargin, setSvgMargin] = useState({x:100, y:50})

    const ref = useRef();

    let plotData = useMemo(() => { return selectedPredicate.attribute_score_data[feature[0]][0]}, [selectedPredicate]);
   
    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature[0]])).range([0, svgWidth - svgMargin.x]).padding(0.2);
    }, [selectedPredicate, selectedPredicate.feature, feature])

    
 
    let yScale = useMemo(() => {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => m.score))]).range([(svgHeight - svgMargin.y), 0])
    }, [selectedPredicate, selectedPredicate.feature, feature])
    
    const svgRef = useRef(null);
    
    const featureValues = (valArr) => {
        
        if(categoricalFeatures.indexOf(valArr[0]) > -1){

            let arr = Object.entries(valArr[1]);
            let chosen = arr[0][1][0].filter(f => f.predicate === 1);
         
            return chosen[0][valArr[0]]
            
        }

        return ""

        // if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){
        //     return <span>between{` ${valArr[0]} `}and{` ${valArr[1]} `}</span>
        // }else if(valArr.length === 1){
        //     return  <span>{` ${valArr[0]}`}</span>
        // }

        // return (
        //     valArr.map((m, i)=> (
        //         <span key={`fv-${i+1}`}>{` ${m},`}</span>
        //     ))
        // )
    }

    const handleClick = () => {
        dispatch({type:'FEATURE_SELECTED', feature})
    }

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let newW = svg.node().parentNode.parentNode.parentNode.parentNode.getBoundingClientRect().width;
        
        let newMargX = newW * .3;
      
        setSvgWidth(newW)
        setSvgMargin({x: newMargX, y: 30})

        let wrap = svg.append('g');
        wrap.attr("transform", `translate(${svgMargin.x/2}, 0)`)

        let xAxis = wrap.append("g")
        .attr("transform", "translate(10," + (svgHeight - (svgMargin.y)) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let yAxis = wrap.append("g")
        .attr("transform", "translate(10, 0)")
        .call(d3.axisLeft(yScale))

        let barGroup = wrap.append('g')
        barGroup.attr('transform', 'translate(10, 0)')

        let bars = barGroup.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[feature[0]]); })
        .attr("y", function(d) { return yScale(d.score); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return (svgHeight - svgMargin.y) - yScale(d.score); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        })

    }, [selectedPredicate, feature]);

    return(
        <div 
        ref={ref}
        className="feature-nav"
        onClick={handleClick}
        style={{
            padding:5,
            // backgroundColor:'yellow'
        }}
        >
            <div
            style={{
                fontSize:14, 
                fontWeight:600,
                margin:5,
                // backgroundColor:'blue'
            }}
            >{`${feature[0]}: `}
            {featureValues(feature)}
            </div>
            
            <div style={{
                marginTop:10, 
                padding:3, 
                margin:5, 
                // backgroundColor:'red'
                }}>
                <svg ref={svgRef} width={svgWidth} height={svgHeight} />
            </div>
        </div>
    )
}


