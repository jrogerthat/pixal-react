import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureDotPlot = ({xCoord, yCoord, navBool, explanBool, bookmarkData}) => {
 
    const [{selectedPredicate, scaleExtent},] = useContext(DataContext);

    console.log('scale extent',scaleExtent)

    const usedPredData = useMemo(()=> {
        return (bookmarkData !== null && bookmarkData !== undefined) ? bookmarkData.selectedPredicate : selectedPredicate;
    }, [selectedPredicate, bookmarkData]);
   
    let plotDataOptions = {...usedPredData.attribute_data[xCoord], 'Score': usedPredData.attribute_score_data[xCoord]};
    let plotData = plotDataOptions[yCoord][0];

    const svgRef = useRef(null);
    const divRef = useRef();

    const [width, setWidth] = useState(500);
    const [svgHeight, setSvgHeight] = useState(300);

    const [useExtent, setUseExtent] = useState(true);
    
    useEffect(() => {
        if(navBool){
            if(!d3.select('.l-top').empty()){
                setWidth(d3.select('.l-top').style('width').split('px')[0]);
                setSvgHeight(180)
            }
        }else if(explanBool){
            if(!d3.select('.l-top').empty()){
                setWidth(d3.select('.l-top').style('width').split('px')[0]);
                setSvgHeight(200)
            }
        }
        // else if(!navBool && !explanBool && !d3.select('#pivot-plot').empty()){
           
        // }
        
    }, [d3.select('.l-top').empty(), d3.select('#pivot-plot').empty()]);

    let margin = {x:(90), y:(svgHeight * .3)};

    let xScale = useMemo(()=> {
        return scaleExtent ? d3.scaleLinear().domain(d3.extent(plotData.map(m => m[xCoord]))).range([0, (width - margin.x)]) : d3.scaleLinear().domain([0, d3.max(plotData.map(m => m[xCoord]))]).range([0, (width - margin.x)])
     }, [plotData, width, margin.x]);
 
     let yScale = useMemo(()=> {
         return useExtent ? d3.scaleLinear().domain(d3.extent(plotData.map(m => m[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))).range([(svgHeight - (margin.y)), 0]) : d3.scaleLinear().domain(d3.extent(plotData.map(m => m[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))).range([(svgHeight - (margin.y)), 0])
     }, [plotData, width, useExtent, scaleExtent]);

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g');

        if(navBool){
            wrap.attr("transform", `translate(${(margin.x/2) + 30}, ${((margin.y/2) - 15)})`)
        }else{
            wrap.attr("transform", `translate(${(margin.x/2) + 10}, ${((margin.y/2) - 15)})`)
        }
       
        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - margin.y) + ")")
        .call(d3.axisBottom(xScale))
       
        let yAxis = wrap.append('g')
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));

        if(navBool || explanBool) yAxis.style('font-size', 10)

        let points = wrap.selectAll('circle.point').data(plotData).join('circle').classed('point', true);
        points.attr('cx', (d) => xScale(+d[xCoord]))
        .attr('cy', (d)=> {
            console.log(d, yCoord, yScale.range(), yScale(+d[yCoord]));
            return yCoord === 'Score' ? yScale(d.score) : yScale(+d[yCoord])})
        .attr('r', navBool || explanBool ? 4 : 6)
        .attr('fill', (d)=> d.predicate === 1 ? usedPredData.predicate_info.color : 'gray')
        .attr('fill-opacity', .7)
        .attr('stroke', 'gray')
        .attr('stroke-width', 1)

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -((svgHeight/4) + 10))
        .text((yCoord === "score" || yCoord === "Score" ) ? "Anomoly Score" : yCoord)
        .style('font-size', navBool || explanBool ? 10 : 12)
        .style('font-weight', 800)

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", (svgHeight - 10))
        .text(xCoord)
        .style('font-size', navBool || explanBool ? 10 : 11)
        .style('font-weight', 800)

    }, [width, xCoord, yCoord, yScale, xScale, usedPredData.predicate_info.id, scaleExtent]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:width, height:svgHeight}}
                ref={svgRef} />
            </div>
        </div>
    )
}


