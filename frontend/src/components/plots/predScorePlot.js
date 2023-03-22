import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";


function kde(kernel, thresholds, data) {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - +d.score))]);
}

function epanechnikov(bandwidth) {
    return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}

const PredScorePlot = () => {
  
    return(
        // <KDEPlot />
        <DensityBarPlot />
    )
}

export {PredScorePlot}


const DensityBarPlot = () => {
    const [{selectedPredicate}] = useContext(DataContext);

    const [width, setWidth] = useState(300);
    useEffect(() => {
        if(!d3.select('.l-bottom').empty()){
            setWidth(d3.select('.l-bottom').style('width').split('px')[0]);
        }
    }, [d3.select('.l-bottom'), d3.select('.l-bottom').empty()]);

    const height = 220;
    const margin = {x:(90), y:(height * .3)};

    const svgRef = useRef(null);
    let groupData =  Array.from(d3.group(selectedPredicate.predicate_scores, (s)=> s.predicate));

    const yScale = useMemo(() => {
        return d3.scaleLinear().range([(height - margin.y), 0]).domain([0, d3.max(selectedPredicate.predicate_scores.map(m => +m.density))]);
      }, [selectedPredicate.id, selectedPredicate.feature]);

    const xScale = useMemo(() => {
        return d3.scaleLinear().range([0, width - (margin.x)]).domain([0, d3.max(selectedPredicate.predicate_scores.map(m => +m.score))]);
        }, [width, selectedPredicate.id, selectedPredicate.feature]);
  

    useEffect(()=> {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g');
        wrap.attr('transform', `translate(${(margin.x/2)+20}, ${margin.y/2})`)

        const xAxisGenerator = d3.axisBottom(xScale);

        wrap
        .append("g")
        .attr("transform", "translate(0," + (height-(margin.y)) + ")")
        .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        wrap.append("g").call(yAxisGenerator);

        let groups = wrap.selectAll('g.group').data(groupData).join('g').classed('group', true);

        let bars = groups.selectAll('rect.bar').data(d => d[1])
        .join('rect').attr("x", function(d) { return xScale(+d.score); })
        .attr("y", function(d) { return yScale(+d.density); })
        .attr("width", 5)
        .attr("height", function(d) { return (height - margin.y) - yScale(+d.density); })
        .attr("fill", (d) => {
            return d.predicate === true ? selectedPredicate.predicate_info.color : 'gray'
        }).attr('fill-opacity', .5)

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -((height/2) - 30))
        .text("Percentage of Data Points")
        .style('font-size', 11)

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width)/2)
        .attr("y", (height))
        .text("Anomaly Score")
        .style('font-size', 11)

    }, [width, selectedPredicate.predicate_info.id, selectedPredicate.feature, selectedPredicate]);


    return(
        <div><svg ref={svgRef} width={width} height={height} /></div>
    )
}