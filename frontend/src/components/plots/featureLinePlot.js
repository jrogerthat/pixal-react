import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureLinePlot = ({xCoord, yCoord, navBool, explanBool, bookmarkData}) => {
 
    const [{selectedPredicate, scaleExtent}, dispatch] = useContext(DataContext);

    const usedPredData = useMemo(()=> {
        return (bookmarkData !== null && bookmarkData !== undefined) ? bookmarkData.selectedPredicate : selectedPredicate;
    }, [selectedPredicate, bookmarkData]);

    const [width, setWidth] = useState(570);
    const [svgHeight, setSvgHeight] = useState(300)
    
    useEffect(() => {
        if(navBool){
            if(!d3.select('.l-top').empty()){
                setWidth(d3.select('.l-top').style('width').split('px')[0]);
                setSvgHeight(180);

                console.log('this is running', d3.select('.l-top').style('width').split('px')[0]);
            }
        }else if(explanBool){
            // console.log('is this id right',d3.select(`#explan-${yCoord}`));
            if(!d3.select(`#explan-${yCoord}`).empty()){

                setWidth(d3.select(`#explan-${yCoord}`).style('width').split('px')[0]);
                setSvgHeight(200)
            }
        }
        // else if(!navBool && !explanBool && !d3.select('#pivot-plot').empty()){
      
        //     // setWidth(d3.select('#pivot-plot').style('width').split('px')[0] - 50);
        // }
        
    }, [d3.select('.l-top').empty(), d3.select('#pivot-plot').empty()]);

    
    let margin = {x:((90)), y:(svgHeight * .3)};
  
    let plotDataOptions = {...usedPredData.attribute_data[xCoord], 'Score': usedPredData.attribute_score_data[xCoord]};
    let plotData = plotDataOptions[yCoord][0] ? plotDataOptions[yCoord][0] : plotDataOptions[yCoord];
    let selectedRange = usedPredData.predicate_info.predicate.attribute_values[xCoord]
    
    let xScale = useMemo(()=> {
        return d3.scaleTime().domain(d3.extent(plotData.map(m => new Date(m[xCoord])))).range([0, (width - margin.x)])
    }, [width, xCoord]);

    

    let yScale = useMemo(()=> {
        // return d3.scaleLinear().domain([0, d3.max(plotData.map(m => yCoord === 'Score' ? m[yCoord.toLowerCase()] : m[yCoord]))]).range([(svgHeight - (margin.y)), 0])
        return scaleExtent ? d3.scaleLinear().domain(d3.extent(plotData.map(m => yCoord === 'Score' ? m[yCoord.toLowerCase()] : m[yCoord]))).range([(svgHeight - (margin.y)), 2]) : d3.scaleLinear().domain([0, d3.max(plotData.map(m => yCoord === 'Score' ? m[yCoord.toLowerCase()] : m[yCoord]))]).range([(svgHeight - (margin.y)), 2])
    }, [svgHeight, yCoord, scaleExtent]);
    
    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const line = d3.line()
        .x(d => xScale(new Date(d[xCoord])))
        .y(d => yScale(+d[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))

        let wrap = svg.append('g');

       if(navBool){
        wrap.attr("transform", `translate(${(margin.x/2) + 30}, ${((margin.y/2) - 15)})`)
       }else{
        wrap.attr("transform", `translate(${(margin.x/2) + 10}, ${((margin.y/2) - 9)})`)
       }

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (margin.y)) + ")")
        .call(d3.axisBottom(xScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b %y')))


        xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style('font-size', navBool || explanBool ? 6 : 7)
    
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
        .attr('height', svgHeight - margin.y)
        .attr('width', xScale(new Date(selectedRange[1])) - xScale(new Date(selectedRange[0])))
        .attr('x', xScale(new Date(selectedRange[0])))
        .attr('fill', usedPredData.predicate_info.color)
        .style('opacity', .4)

        // if(!explanBool){
        let circleG = wrap.append('g');
            // circleG.attr('transform', 'translate(20, 0)')
            
        circleG.selectAll('circle.dot')
            .data(plotData)
            .join('circle')
            .attr('cx', d => xScale(new Date(d[xCoord])))
            .attr('cy', d => yScale(+d[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))
            .attr('r', 4)
            .attr('fill', 'gray')
            .attr('fill-opacity', .6)

        wrap.append('text')
            .text(selectedRange.join('-'))
            .attr('font-size', 10)
            // .attr('font-weight', 700)
            .attr('x', xScale(new Date(selectedRange[0])))
            .attr('y', -2)
            .attr('text-anchor', 'middle')

        wrap.append('text')
            .text("Predicate ranges from")
            .attr('font-size', 10)
            // .attr('font-weight', 700)
            .attr('x', xScale(new Date(selectedRange[0])))
            .attr('y', -12)
            .attr('text-anchor', 'middle')
            
        // }

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", navBool ? (-(svgHeight/4) + 20) : (-(svgHeight/4)))
        .text((yCoord === "score" || yCoord === "Score" ) ? "Anomoly Score" : yCoord)
        .style('font-size', navBool || explanBool ? 10 : 11)
        .style('font-weight', 800)

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", navBool ? (svgHeight + 15) : (svgHeight + 5))
        .text(xCoord)
        .style('font-size', navBool || explanBool ? 10 : 11)
        .style('font-weight', 800)

    
    }, [width, xCoord, yCoord, yScale, xScale, usedPredData.predicate_info.id, scaleExtent]);

    return(
        <div 
        className="feature-line"
        >
            <div ref={divRef}>
                <svg 
                style={{width:(width), height:(svgHeight + 20)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


