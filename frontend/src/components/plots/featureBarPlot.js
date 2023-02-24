import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureBarPlot = ({selectedParam, width, height}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const feature = selectedPredicate.feature[0];

   

    // let plotData = useMemo(() => { return selectedPredicate.attribute_score_data[feature[0]]}, [selectedPredicate]);
    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};


    let plotData = plotDataOptions[selectedParam];

    console.log('plottt',plotDataOptions);

    let xScale = d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, width]).padding(0.2);
    let yScale = d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[selectedParam === 'Score' ? 'score' : selectedParam]))]).range([height, 0])
    const svgRef = useRef(null);
    
    
    useEffect(()=> {

        const svgElement = d3.select(svgRef.current);

        svgElement.selectAll('*').remove();

        let wrap = svgElement.append('g');

        let xAxis = wrap.append("g")
        .attr("transform", "translate(10," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let bars = wrap.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[feature]); })
        .attr("y", function(d) { return yScale(d[selectedParam === 'Score' ? 'score' : selectedParam]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[selectedParam === 'Score' ? 'score' : selectedParam]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        })


    }, [selectedPredicate]);

    return(
        <div 
        className="feature-bar"
        >
            <div>
                <svg ref={svgRef} />
            </div>
        </div>
    )
}


