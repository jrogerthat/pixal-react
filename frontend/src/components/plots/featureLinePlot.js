import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureLinePlot = ({xCoord, yCoord, navBool, explanBool}) => {
 
    const [{selectedPredicate}, dispatch] = useContext(DataContext);


    let initWidth = () => {
        if(navBool){
            return !d3.select('#feat-nav-wrap-left').empty() ? d3.select('#feat-nav-wrap-left').node().getBoundingClientRect().width : 300;
        }else if(explanBool){
            return 200;
        }else{
            if(d3.select('#pivot-plot').node()){
                console.log('width',d3.select('#pivot-plot').node().getBoundingClientRect().width)
                return d3.select('#pivot-plot').node().getBoundingClientRect().width
            }else{
                return 600;
            }
        }
    }

    let initHeight = () => {
        if(navBool){
            return 200;
        }else if(explanBool){
            return 100;
        }else{
            return 300;
        }
    }

    let [svgWidth, setSvgWidth] = useState(initWidth());
    let [svgHeight, setSvgHeight] = useState(initHeight());
    let [svgMargin, setSvgMargin] = useState({x:(svgWidth * .2), y:(svgHeight * .3)});

    // useEffect(() => {
    //     if(explanBool){
    //         // setSvgWidth(200)
    //     }else if(navBool && d3.select('#feat-nav-wrap-left') != null){
    //         setSvgWidth(d3.select('#feat-nav-wrap-left').select('.feature-nav').node().getBoundingClientRect().width)
    //     }else{
    //         // setSvgWidth(d3.select('#pivot-plot').node().getBoundingClientRect().width)
    //     }
    // }, [d3.select('#feat-nav-wrap-left'),d3.select('#pivot-plot').node(), yCoord, xCoord]);

  
    let plotDataOptions = {...selectedPredicate.attribute_data[xCoord], 'Score': selectedPredicate.attribute_score_data[xCoord]};

    let plotData = plotDataOptions[yCoord][0] ? plotDataOptions[yCoord][0] : plotDataOptions[yCoord];

    let selectedRange = selectedPredicate.predicate_info.predicate.attribute_values[xCoord]
    
    let xScale = useMemo(()=> {
        return d3.scaleTime().domain(d3.extent(plotData.map(m => new Date(m[xCoord])))).range([0, (svgWidth - svgMargin.x)])
    }, [svgWidth, xCoord]);

    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => yCoord === 'Score' ? m[yCoord.toLowerCase()] : m[yCoord]))]).range([(svgHeight - (svgMargin.y)), 0])
    }, [svgHeight, yCoord]);
    
    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const line = d3.line()
        .x(d => xScale(new Date(d[xCoord])))
        .y(d => yScale(+d[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))

        let wrap = svg.append('g');

        wrap.attr('transform', `translate(${(svgMargin.x/2)}, ${(svgMargin.y / 2)})`)

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (svgMargin.y)) + ")")
        .call(d3.axisBottom(xScale))

        xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
        let yAxis = wrap.append('g')
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));

        let pathG = wrap.append("path")
        .datum(plotData)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("fill-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("d", line);

        // pathG.attr('transform', 'translate(20, 0)')

        wrap.append('rect')
        .attr('height', svgHeight - svgMargin.y)
        .attr('width', xScale(new Date(selectedRange[1])) - xScale(new Date(selectedRange[0])))
        .attr('x', xScale(new Date(selectedRange[0])))
        .attr('fill', selectedPredicate.predicate_info.color)
        .style('opacity', .5)

        if(!explanBool){
            let circleG = wrap.append('g');
            // circleG.attr('transform', 'translate(20, 0)')
            
            circleG.selectAll('circle.dot')
            .data(plotData)
            .join('circle')
            .attr('cx', d => xScale(new Date(d[xCoord])))
            .attr('cy', d => yScale(+d[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))
            .attr('r', 4)
            .attr('fill', 'gray')
            .attr('fill-opacity', .5)

            wrap.append('text')
            .text(selectedRange.join('-'))
            .attr('font-size', 10)
            .attr('x', xScale(new Date(selectedRange[0])))
            .attr('y', -2)
            .attr('text-anchor', 'middle')

            wrap.append('text')
            .text("Predicate ranges from")
            .attr('font-size', 10)
            .attr('x', xScale(new Date(selectedRange[0])))
            .attr('y', -12)
            .attr('text-anchor', 'middle')
            
        }

    
    }, [xCoord, yCoord, yScale, xScale, selectedPredicate.predicate_info.id]);

    return(
        <div 
        className="feature-line"
        >
            <div ref={divRef}>
                <svg 
                style={{width:(svgWidth), height:(svgHeight)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


