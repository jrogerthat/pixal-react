import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";

const PredExplorePlot = ({width, height}) => {
    
    const axesRef = useRef(null);
    const [{predicateArray, predicateDistributionArray, hiddenPredicates}, dispatch] = useContext(DataContext);

   

    let filteredDist = [...predicateDistributionArray].filter(f => {
        if(hiddenPredicates.length === 0){
            return f
        }else{
            return hiddenPredicates.indexOf(f[0]) === -1
        }
    });

    const yScale = useMemo(() => {
        if(predicateDistributionArray.length > 0){
            let maxArr =  predicateDistributionArray.flatMap(m => m[1]).map(m => +m.density);
            return d3.scaleLinear().range([(height-50), 0]).domain([0, d3.max(maxArr)]);
        }else{
             return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [predicateDistributionArray, height]);

    const xScale = useMemo(() => {
        if(predicateDistributionArray.length > 0){
            let maxArr = predicateDistributionArray.flatMap(m => m[1]).map(m => m.bin)
            return d3.scaleLinear().range([0, width]).domain([0, d3.max(maxArr)]);
        }else{
            return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [predicateDistributionArray, width]);
   

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
                filteredDist.length > 0 && filteredDist.map((p, i) => (
                    <PredicateGroup 
                    key={`pred-${i+1}`} 
                    predData={p[1]} 
                    xScale={xScale} 
                    yScale={yScale} 
                    height={height} 
                    color={predicateArray.filter(f=> +p[0] === +f.id)[0]}
                    />
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

const PredicateGroup = ({predData, yScale, xScale, height, color}) => {

    const [{highlightedPred}, dispatch] = useContext(DataContext);

    let calcColor = highlightedPred != null && highlightedPred != color.id ? 'rgba(211,211,211, .2)' : color.color
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