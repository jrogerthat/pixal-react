import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";



export const FeatureBarPlot = ({yCoord, feature, navBool}) => {
   
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(navBool ? 200 : 300);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};

    let plotData = plotDataOptions[yCoord][0];

    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, (svgWidth - svgMargin.x)]).padding(0.2);
    }, [svgWidth, feature])
    
    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]))]).range([(svgHeight - (svgMargin.y)), 0])
    }, [yCoord])
   
    const svgRef = useRef(null);
    const divRef = useRef();

    
    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let newW = navBool ? d3.select('#feat-nav-wrap-left').select('.feature-nav').node().getBoundingClientRect().width : 700;
        let newMargX = newW * .3;
        let newMargY = svgHeight * .3;

        setSvgWidth(newW)
        setSvgMargin({x: newMargX, y: newMargY})

        let wrap = svg.append('g');

        wrap.attr("transform", 'translate(40, 10)')

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (svgMargin.y)) + ")")

        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let yAxis = wrap.append('g')
        .attr("transform", "translate(-5, 0)")
        .call(d3.axisLeft(yScale));

        let bars = wrap.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[feature]); })
        .attr("y", function(d) { return yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return (svgHeight - svgMargin.y) - yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        })


    }, [feature, yCoord, yScale, selectedPredicate.predicate_info.id]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:(svgWidth), height:(svgHeight)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


