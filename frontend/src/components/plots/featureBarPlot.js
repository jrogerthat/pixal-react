import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureBarPlot = ({yCoord, feature, navBool, explanBool}) => {
   
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    let initWidth = () => {
        if(navBool){
            return !d3.select('#feat-nav-wrap-left').empty() ? d3.select('#feat-nav-wrap-left').node().getBoundingClientRect().width : 300;
        }else if(explanBool){
            return 350;
        }else{
            return 600;
        }
    }

    let initHeight = () => {
        if(navBool){
            return 200;
        }else if(explanBool){
            return 160;
        }else{
            return 300;
        }
    }

    let [svgWidth, setSvgWidth] = useState(initWidth());
    let [svgHeight, setSvgHeight] = useState(initHeight());
    let [svgMargin, setSvgMargin] = useState({x:(svgWidth * .2), y:(svgHeight * .3)});

    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};
    let plotData = plotDataOptions[yCoord][0];

    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, (svgWidth - svgMargin.x)]).padding(0.2);
    }, [svgWidth, feature])
    
    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]))]).range([(svgHeight - (svgMargin.y)), 0])
    }, [svgHeight, yCoord])
   
    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g').classed('wrap', true);

        wrap.attr("transform", `translate(${svgMargin.x/2}, ${((svgMargin.y/2) - 15)})`)

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (svgMargin.y)) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('font-size', (navBool || explanBool) ? 8 : 10)

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
        }).attr('fill-opacity', .6)

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -(svgHeight/4))
        .text(yCoord)
        .style('font-size', navBool || explanBool ? 9 : 12)

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", svgWidth/2)
        .attr("y", (svgHeight + 10))
        .text(feature)
        .style('font-size', navBool || explanBool ? 9 : 12)

    }, [feature, yCoord, yScale, selectedPredicate.predicate_info.id]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:svgWidth, height:(svgHeight + 15)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


