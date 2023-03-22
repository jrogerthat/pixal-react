import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";

const PredExplorePlot = ({width, height}) => {
    
    const axesRef = useRef(null);
    const [{predicateArray, predicateDistributionArray, hiddenPredicates, deletedPredicates}, dispatch] = useContext(DataContext);

    let filteredDist = [...predicateDistributionArray].filter(f => {
        if(hiddenPredicates.length === 0){
            return f
        }else{
            return hiddenPredicates.indexOf(f[0]) === -1 && deletedPredicates.indexOf(f[0]) === -1
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
            let maxArr = predicateDistributionArray.flatMap(m => m[1]).map(m => m.score)
            return d3.scaleLinear().range([0, width]).domain(d3.extent(maxArr));
        }else{
            return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [predicateDistributionArray, width]);
   
    console.log('in explore plot',predicateArray, predicateDistributionArray)

      // Render the X axis using d3.js, not react
    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        const wrap = svgElement.append('g').attr('id', 'wrap-explore');

        const xAxisGenerator = d3.axisBottom(xScale);
        wrap
        .append("g")
        .attr("transform", "translate(0," + (height-50) + ")")
        .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        wrap.append("g").call(yAxisGenerator);

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -(height/4))
        .text("Percentage of Data Points")

        // Add X axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2) - 20)
        .attr("y", (height - 20))
        .text("Anomaly Score")
        .style('font-size', 13)

    }, [predicateDistributionArray, xScale, yScale, height]);
    
   
    return(
        <svg width={width + 20} height={height + 20} >
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
            transform={`translate(${[60, 30].join(",")})`}
            />
        </svg>
    )
}

const PredicateGroup = ({predData, yScale, xScale, height, color}) => {

    const [{highlightedPred}] = useContext(DataContext);

    let calcColor = highlightedPred != null && highlightedPred != color.id ? 'rgba(211,211,211, .2)' : color.color
        return(
        <g
        transform={`translate(${[60, 0].join(",")})`}
        >
        {
            predData.map((p, i) => (
                <rect key={`b-${i}`}
                    fill={calcColor}
                    x={xScale(p.score)} 
                    width="5px" 
                    height={(height - 50)-yScale(p.density)}
                    transform={`translate(0,${yScale(p.density) + 30})`}
                    style={{fillOpacity: .6, stroke: calcColor}}
                />
            ))
        }
        </g>
    )
}

export {PredExplorePlot}