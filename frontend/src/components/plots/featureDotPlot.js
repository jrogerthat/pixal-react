import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureDotPlot = ({xCoord, yCoord, categorical, navBool, explanBool}) => {
 
    const [{selectedPredicate, categoricalFeatures}, dispatch] = useContext(DataContext);
   
    let plotDataOptions = {...selectedPredicate.attribute_data[xCoord], 'Score': selectedPredicate.attribute_score_data[xCoord]};

    let plotData = plotDataOptions[yCoord][0];

    const svgRef = useRef(null);
    const divRef = useRef();

    const [width, setWidth] = useState(300);
    useEffect(() => {
        if(!d3.select('.l-top').empty()){
            setWidth(d3.select('.l-top').style('width').split('px')[0]);
        }
    }, [d3.select('.l-top'), d3.select('.l-top').empty()]);

   
    let svgHeight = 200;
    let margin = {x:(90), y:(svgHeight * .3)};

    let xScale = useMemo(()=> {
        return d3.scaleLinear().domain([0, d3.max(plotData.map(m => m[xCoord]))]).range([0, (width - margin.x)])
     }, [plotData, width, margin.x]);
 
     let yScale = useMemo(()=> {
         return d3.scaleLinear().domain(d3.extent(plotData.map(m => m[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))).range([(svgHeight - (margin.y)), 0])
     }, [plotData, width]);

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g');

        wrap.attr("transform", `translate(${(margin.x/2)+20}, ${((margin.y/2) - 15)})`)
       
        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - margin.y) + ")")
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
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -((svgHeight/4) + 10))
        .text((yCoord === "score" || yCoord === "Score" ) ? "Anomoly Score" : yCoord)
        .style('font-size', navBool || explanBool ? 9 : 12)


        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", (svgHeight - 10))
        .text(xCoord)
        .style('font-size', navBool || explanBool ? 9 : 11)
        

    }, [width, xCoord, yCoord, yScale, xScale, selectedPredicate.predicate_info.id]);

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


