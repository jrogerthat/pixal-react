import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureLinePlot = ({xCoord, yCoord, navBool}) => {
 
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(navBool ? 200 : 300);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    // let plotData = useMemo(() => { return selectedPredicate.attribute_score_data[xCoord[0]]}, [selectedPredicate]);
    let plotDataOptions = {...selectedPredicate.attribute_data[xCoord], 'Score': selectedPredicate.attribute_score_data[xCoord]};

    console.log('plotDataOptions',plotDataOptions)

    let plotData = plotDataOptions[yCoord][0] ? plotDataOptions[yCoord][0] : plotDataOptions[yCoord];

    let selectedRange = selectedPredicate.predicate_info.predicate.attribute_values[xCoord]
    
    let x = useMemo(()=> {
        return d3.scaleTime().domain(d3.extent(plotData.map(m => new Date(m[xCoord])))).range([0, (svgWidth - svgMargin.x)])
    }, [svgWidth, xCoord]);

    
    let y = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => yCoord === 'Score' ? m[yCoord.toLowerCase()] : m[yCoord]))]).range([(svgHeight - (svgMargin.y)), 0])
    }, [svgHeight, yCoord]);
    
    const svgRef = useRef(null);
    const divRef = useRef();

    console.log("POPT DATA", plotData);

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // let newW = svg.node().parentNode.parentNode.parentNode.parentNode.getBoundingClientRect().width;
        let newW = navBool ? d3.select('#feat-nav-wrap-left').node().getBoundingClientRect().width : 700;
        let newMargX = newW * .3;
        let newMargY = svgHeight * .3;

        const line = d3.line()
        .x(d => x(new Date(d[xCoord])))
        .y(d => y(+d[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))

        // setSvgHeight(newH)
        setSvgWidth(newW)
        setSvgMargin({x: newMargX, y: newMargY})

        let wrap = svg.append('g');

        wrap.attr('transform', 'translate(20, 0)')

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - svgMargin.y) + ")")
        .call(d3.axisBottom(x))

        xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
        let yAxis = wrap.append('g')
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(y));

        let pathG = svg.append("path")
        .datum(plotData)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("fill-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("d", line);

        pathG.attr('transform', 'translate(20, 0)')


        wrap.append('rect')
        .attr('height', svgHeight - svgMargin.y)
        .attr('width', x(new Date(selectedRange[1])) - x(new Date(selectedRange[0])))
        .attr('x', x(new Date(selectedRange[0])))
        .attr('fill', selectedPredicate.predicate_info.color)
        .style('opacity', .5)

    
    }, [xCoord, yCoord, y, x]);

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


