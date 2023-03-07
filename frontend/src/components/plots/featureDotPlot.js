import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureDotPlot = ({xCoord, yCoord, categorical, navBool, explanBool}) => {
 
    const [{selectedPredicate, categoricalFeatures}, dispatch] = useContext(DataContext);
   
    let plotDataOptions = {...selectedPredicate.attribute_data[xCoord], 'Score': selectedPredicate.attribute_score_data[xCoord]};

    let plotData = plotDataOptions[yCoord][0];

    const svgRef = useRef(null);
    const divRef = useRef();

    let initWidth = () => {
        if(navBool){
            return !d3.select('#feat-nav-wrap-left').empty() ? d3.select('#feat-nav-wrap-left').node().getBoundingClientRect().width : 250;
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

    let xScale = useMemo(()=> {
        return d3.scaleLinear().domain([0, d3.max(plotData.map(m => m[xCoord]))]).range([0, (svgWidth - svgMargin.x)])
     }, [plotData, svgWidth, svgMargin.x]);
 
     let yScale = useMemo(()=> {
         return d3.scaleLinear().domain(d3.extent(plotData.map(m => m[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))).range([(svgHeight - (svgMargin.y)), 0])
     }, [plotData, svgWidth]);

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g');

        wrap.attr("transform", `translate(${svgMargin.x/2}, ${((svgMargin.y/2) - 15)})`)
        // wrap.attr('transform', `translate(${(svgMargin.x/2)}, ${(svgMargin.y/2)})`)

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - svgMargin.y) + ")")
        .call(d3.axisBottom(xScale))
       
        let yAxis = wrap.append('g')
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));

        let points = wrap.selectAll('circle.point').data(plotData).join('circle').classed('point', true);
        points.attr('cx', (d) => xScale(+d[xCoord]))
        .attr('cy', (d)=> yScale(+d[yCoord.toLowerCase()]))
        .attr('r', 6)
        .attr('fill', (d)=> d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray')
        .attr('fill-opacity', .6)
        .attr('stroke', 'gray')
        .attr('stroke-width', 1)

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -(svgHeight/4))
        .text(yCoord)
        .style('font-size', navBool || explanBool ? 9 : 11)

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (svgWidth/2))
        .attr("y", (svgHeight - 10))
        .text(xCoord)
        .style('font-size', navBool || explanBool ? 9 : 11)
        

    }, [xCoord, yCoord, yScale, xScale, selectedPredicate.predicate_info.id]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:svgWidth, height:svgHeight}}
                ref={svgRef} />
            </div>
        </div>
    )
}


