import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";

const PredExplorePlot = ({distData, width, height, colorDict, highlightPred}) => {
   

    const axesRef = useRef(null);

    const yScale = useMemo(() => {
        if(distData.length > 0){
            let maxArr =  distData.flatMap(m => m[1]).map(m => +m.density);
            return d3.scaleLinear().range([(height-50), 0]).domain([0, d3.max(maxArr)]);
        }else{
             return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [distData, height]);

    const xScale = useMemo(() => {
        if(distData.length > 0){
            let maxArr = distData.flatMap(m => m[1]).map(m => m.bin)
            console.log(maxArr,d3.max(maxArr))
            return d3.scaleLinear().range([0, width]).domain([0, d3.max(maxArr)]);
        }else{
            return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [distData, width]);
   

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
            {
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
            }
            <g
            width={width}
            height={20}
            ref={axesRef}
            transform={`translate(${[30, 30].join(",")})`}
            />
        </svg>
    )
}

const PredicateGroup = ({predData, yScale, xScale, height, color, highlightPred}) => {
   let calcColor = highlightPred != null && highlightPred != color.id ? 'rgba(211,211,211, .2)' : color.color
    return(
        <g>
        {
            predData.map((p, i) => (
                <rect key={`b-${i}`}
                    fill={calcColor}
                    x={xScale(p.bin)} 
                    width="5px" 
                    height={(height - 50)-yScale(p.density)}
                    transform={`translate(0,${yScale(p.density) + 30})`}
                />
            ))
        }
        </g>
    )
}

export {PredExplorePlot}