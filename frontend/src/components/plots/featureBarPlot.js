import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureBarPlot = ({yCoord, feature, navBool, explanBool}) => {
   
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    const [width, setWidth] = useState(500);
    const [svgHeight, setSvgHeight] = useState(300)
    // let svgHeight = 200;
    
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
        }else if(!navBool && !explanBool && !d3.select('#pivot-plot').empty()){
            // console.log('width',d3.select('#pivot-plot').style('width'));
            // setWidth(d3.select('#pivot-plot').style('width').split('px')[0] - 50);
        }
        
    }, [d3.select('.l-top').empty(), d3.select('#pivot-plot').empty()]);

    let margin = {x:(90), y:(svgHeight * .3)};

    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};
    let plotData = plotDataOptions[yCoord][0];

    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, (width - margin.x)]).padding(0.2);
    }, [width, feature])

    
    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]))]).range([(svgHeight - (margin.y)), 0])
    }, [svgHeight, yCoord])
   
    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g').classed('wrap', true);

        wrap.attr("transform", `translate(${(margin.x/2) + 30}, ${((margin.y/2) - 15)})`)

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (margin.y)) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('font-size', (navBool || explanBool) ? 8 : 10)

        let yAxis = wrap.append('g')
        .attr("transform", "translate(-0, 0)")
        .call(d3.axisLeft(yScale));

        let bars = wrap.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[feature]); })
        .attr("y", function(d) { return yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return (svgHeight - margin.y) - yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        }).attr('fill-opacity', .6)

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
        .attr("x", width/2)
        .attr("y", (svgHeight + 10))
        .text(feature)
        .style('font-size', navBool || explanBool ? 10 : 12)
        .style('font-weight', 800)
       

    }, [width, feature, yCoord, yScale, selectedPredicate.predicate_info.id]);

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


