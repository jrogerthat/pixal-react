import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";

const PredScorePlot = ({width, height}) => {
   
    const [{selectedPredicate, predicateArray}, dispatch] = useContext(DataContext);
    const axesRef = useRef(null);

    console.log(selectedPredicate.predicate_scores)

    const yScale = useMemo(() => {
        if(selectedPredicate.predicate_scores > 0){
            // let maxArr =  distData.flatMap(m => m[1]).map(m => +m.density);
            // return d3.scaleLinear().range([(height-50), 0]).domain([0, d3.max(maxArr)]);
        }else{
             return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [selectedPredicate.predicate_scores, height]);

    const xScale = useMemo(() => {
        if(selectedPredicate.predicate_scores.length > 0){
            // let maxArr = distData.flatMap(m => m[1]).map(m => m.bin)
            // console.log(maxArr,d3.max(maxArr))
            // return d3.scaleLinear().range([0, width]).domain([0, d3.max(maxArr)]);
        }else{
            return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [selectedPredicate.predicate_scores, width]);
   

      // Render the X axis using d3.js, not react
    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();
        const xAxisGenerator = d3.axisBottom(xScale);
        svgElement
        .append("g")
        .attr("transform", "translate(0," + (height-50) + ")")
        .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement.append("g").call(yAxisGenerator);
    }, [xScale, yScale, height]);
    
  
    return(
        <svg width={width} height={height} >
            {/* {
                distData.length > 0 && distData.map(p => (
                    <PredicateGroup 
                    key={p[0]} 
                    predData={p[1]} 
                    xScale={xScale} 
                    yScale={yScale} 
                    height={height} 
                    color={colorDict.filter(f=> +p[0] === +f.id)[0]}
                    highlightPred={highlightPred} />
                ))
            } */}
            <g
            width={width}
            height={20}
            ref={axesRef}
            transform={`translate(${[30, 30].join(",")})`}
            />
        </svg>
    )
}



export {PredScorePlot}