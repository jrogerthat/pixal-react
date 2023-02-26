import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../context";
import * as d3 from "d3";


export const PixalFeatureNav = ({feature, divWidth}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    console.log('selected pred',selectedPredicate, feature)
 
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(200);
  
    useEffect(()=> {
       
        if(divWidth && typeof divWidth === 'string'){
            setWidth((+divWidth.split('px')[0]) - 65)
            setHeight((width * .6))
        }
       
    }, [divWidth])

    let plotData = useMemo(() => { return selectedPredicate.attribute_score_data[feature[0]]}, [selectedPredicate]);
   
    let xScale = d3.scaleBand().domain(plotData.map(m => m[feature[0]])).range([0, width]).padding(0.2);
    let yScale = d3.scaleLinear().domain([0,d3.max(plotData.map(m => m.score))]).range([height, 0])
    const svgRef = useRef(null);
    
    const featureValues = (valArr) => {
        if(isDate(valArr[0]) || (isNaN(valArr[0]) === false)){
            return <span>between{` ${valArr[0]} `}and{` ${valArr[1]} `}</span>
        }else if(valArr.length === 1){
            return  <span>{` ${valArr[0]}`}</span>
        }

        return (
            valArr.map((m, i)=> (
                <span key={`fv-${i+1}`}>{` ${m},`}</span>
            ))
        )
    }

    const handleClick = () => {
        dispatch({type:'FEATURE_SELECTED', feature})
    }

    useEffect(()=> {

        const svgElement = d3.select(svgRef.current);

        svgElement.selectAll('*').remove();

        let wrap = svgElement.append('g');

        wrap.attr("transform", "translate(30, 0)")

        let xAxis = wrap.append("g")
        .attr("transform", "translate(10," + height + ")")
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
        .attr("height", function(d) { return height - yScale(d.score); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        })


    }, [selectedPredicate]);

    return(
        <div 
        className="feature-nav"
        onClick={handleClick}
        >
            <div
            style={{
                fontSize:14, 
                fontWeight:600,
                margin:5
            }}
            >{`${feature[0]}: `}
            {/* {featureValues(feature[1])} */}
            </div>
            <div style={{marginTop:10}}>
                <svg ref={svgRef} width={divWidth}/>
            </div>
        </div>
    )
}


