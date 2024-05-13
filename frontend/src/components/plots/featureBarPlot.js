import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureBarPlot = ({xCoord, yCoord, explanBool, bookmarkData, width, svgHeight}) => {
   
    const [{selectedPredicate, scaleExtent}] = useContext(DataContext);
    const usedPredData = useMemo(()=> {
        return (bookmarkData !== null && bookmarkData !== undefined) ? bookmarkData.selectedPredicate : selectedPredicate;
    }, [selectedPredicate, bookmarkData]);

    let margin = () => {
       if(explanBool){
            return {x:60, y:60}
        }else{
            return {x: 50, y: 10}
        }
    };

    let plotDataOptions = {...usedPredData.attribute_data[xCoord], 'Score': usedPredData.attribute_score_data[xCoord]};
    let plotData = plotDataOptions[yCoord][0];
    
    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[xCoord])).range([0, (width - margin().x)])
        //.padding(0.2);
    }, [width, xCoord, plotData])

    let extentOfData = d3.extent(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]));
    let yScale = useMemo(()=> {
        return scaleExtent ? d3.scaleLinear().domain([extentOfData[0] - (extentOfData[0]*.05), extentOfData[1]]).range([(svgHeight - (margin().y)), 0]) : d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]))]).range([(svgHeight - (margin().y)), 0])
    }, [svgHeight, yCoord, scaleExtent, plotData])
   
    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {
   
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        let wrap = svg.append('g').classed('wrap', true);

        if(explanBool){
            wrap.attr("transform", `translate(${((margin().x/2) + 10)}, ${((margin().y/2))})`)
        }else{
            wrap.attr("transform", `translate(${((margin().x/2)) + 10}, ${((margin().y/2) - 40)})`)
        }
       
        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (margin().y)) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('font-size', (explanBool) ? 8 : 10)

        let yAxis = wrap.append('g')
        .attr("transform", "translate(-0, 0)")
        .call(d3.axisLeft(yScale));

        let bars = wrap.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[xCoord]); })
        .attr("y", function(d) { return yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return (svgHeight - margin().y) - yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? usedPredData.predicate_info.color : 'gray'
        }).attr('fill-opacity', .6)

        if(explanBool){
            // Y axis label:
            wrap.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("y", -27)
                .attr("x", -((svgHeight/4) + 10))
                .text((yCoord === "score" || yCoord === "Score" ) ? "Anomoly Score" : yCoord)
                .style('font-size', explanBool ? 10 : 12)
                .style('font-weight', 800)

            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("x", width/2)
                .attr("y", (svgHeight + 10))
                .text(xCoord)
                .style('font-size', explanBool ? 10 : 12)
                .style('font-weight', 800)
        }
       
        if(plotData.length > 50){
            svg.selectAll('.tick').selectAll('text').style('font-size', 6)
        }
        
       
       

    }, [width, xCoord, yCoord, yScale, xScale, usedPredData.predicate_info.id, scaleExtent]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:width, height:(svgHeight + 15)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


