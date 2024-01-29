import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";


const PredScorePlot = () => {
  
    return(
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
        return d3.scaleLinear().range([0, width - (margin.x)]).domain([0, d3.max(selectedPredicate.predicate_scores//.filter(f=> +f.density > .001)
            .map(m => +m.score))]);
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

        groups.selectAll('rect.bar').data(d => d[1])
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
        .attr("x", ((height/2) - 180))
        .text("Percentage of Data Points")
        .style('font-size', 10)

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width)/2)
        .attr("y", (height))
        .text("Anomaly Score")
        .style('font-size', 11)

        //Initialize legend
        var legendItemSize = 12;
        // var legendSpacing = 4;
        // var xOffset = 150;
        // var yOffset = 100;

        var legend = svg.append('g')
        legend.classed('.legend-group');

        let onG = legend.append('g');
        onG.append('rect').attr('width', legendItemSize).attr('height', legendItemSize).attr('fill', selectedPredicate.predicate_info.color);
        let labelOn = onG.append('text').text('Selected Predicate Anomaly Scores').style('font-size', 9);
        labelOn.attr('x', 15).attr('y', 9)

        onG.attr('transform', `translate(210,10)`)

        let offG = legend.append('g');
        offG.append('rect').attr('width', legendItemSize).attr('height', legendItemSize).attr('fill', 'gray');
        let labelOff = offG.append('text').text('All Other Anomaly Scores').style('font-size', 9);
        labelOff.attr('x', 15).attr('y', 9)

        offG.attr('transform', `translate(70,10)`)

          

        // //Create legend items
        // legend
        // .enter()
        // .append('rect')
        // .attr('class', 'legendItem')
        // .attr('width', legendItemSize)
        // .attr('height', legendItemSize)
        // .style('fill', d => d.color)
        // .attr('transform',
        //         (d, i) => {
        //             var x = xOffset;
        //             var y = yOffset + (legendItemSize + legendSpacing) * i;
        //             return `translate(${x}, ${y})`;
        //         });

        // //Create legend labels
        // legend
        // .enter()
        // .append('text')
        // .attr('x', xOffset + legendItemSize + 5)
        // .attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
        // .text(d => d.name);  

    }, [width, selectedPredicate.predicate_info.id, selectedPredicate.feature, selectedPredicate]);


    return(
        <div><svg ref={svgRef} width={width} height={height} /></div>
    )
}