import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";


const PredScorePlot = ({width, height}) => {
   
    const axesRef = useRef(null);

    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const yScale = useMemo(() => {
        d3.max(selectedPredicate.predicate_scores.map(f => f.density))
        return d3.scaleLinear().range([height, 0]).domain([0, d3.max(selectedPredicate.predicate_scores.map(f => f.density))]);
    }, [selectedPredicate.predicate_scores, height]);

    const xScale = useMemo(() => {
        return d3.scaleLinear().range([0, width]).domain([0, d3.max(selectedPredicate.predicate_scores.map(f => f.iforest_score))]);
    }, [selectedPredicate.predicate_scores, width]);

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

    let distScoreData = Array.from(d3.group(selectedPredicate.predicate_scores, d => d.predicate));

    return(
        <svg width={width} height={height}>
            {
                distScoreData.map(d => (
                    <ScoreGroup key={`isPred${d[0]}`} data={d} yScale={yScale} xScale={xScale} />
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

const ScoreGroup = ({data, xScale, yScale}) => {
    let color = data[0] ? 'blue' : 'gray';

    const gRef = useRef(null);

    useEffect(()=> {

        const gElement = d3.select(gRef.current);
        gElement.append("path")
        .attr("class", "mypath")
        .datum(data[1])
        .attr("fill", color)
        .attr("opacity", ".6")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d.iforest_score); })
            .y(function(d) { return yScale(d.density); })
        );

    }, [data]);

    return(
        <g ref={gRef}>{data[0]}</g>
    )
}



export {PredScorePlot}