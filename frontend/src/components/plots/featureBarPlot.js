import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureBarPlot = ({selectedParam, width, height}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const feature = selectedPredicate.feature[0];

    // let plotData = useMemo(() => { return selectedPredicate.attribute_score_data[feature[0]]}, [selectedPredicate]);
    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};

    let plotData = plotDataOptions[selectedParam];

    let xScale = d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, width]).padding(0.2);
    let yScale = d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[selectedParam === 'Score' ? 'score' : selectedParam]))]).range([(height), 0])
   
    
    const svgRef = useRef(null);

    const divRef = useRef();

    const [divWidth, setDivWidth] = useState();
    
    
    useEffect(()=> {



        const svgElement = d3.select(svgRef.current);

        svgElement.selectAll('*').remove();

        let wrap = svgElement.append('g');

        wrap.attr("transform", 'translate(40, 20)')

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (height) + ")")

        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let yAxis = wrap.append('g')
        .attr("transform", "translate(-5, 0)")
        .call(d3.axisLeft(yScale));

        let bars = wrap.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[feature]); })
        .attr("y", function(d) { return yScale(d[selectedParam === 'Score' ? 'score' : selectedParam]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[selectedParam === 'Score' ? 'score' : selectedParam]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        })


    }, [selectedPredicate, selectedParam, yScale]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:(width + 50)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


