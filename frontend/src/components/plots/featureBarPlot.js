import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";

export const FeatureBarPlot = ({yCoord, feature, navBool, explanBool, pivotBool, bookmarkData}) => {
   
    const [{selectedPredicate, scaleExtent}] = useContext(DataContext);

    const [width, setWidth] = useState(560);
    const [svgHeight, setSvgHeight] = useState(300)

    const usedPredData = useMemo(()=> {
        return (bookmarkData !== null && bookmarkData !== undefined) ? bookmarkData.selectedPredicate : selectedPredicate;
    }, [selectedPredicate, bookmarkData]);
    
    useEffect(() => {
        if(navBool){
            if(!d3.select('.l-top').empty()){
                setWidth(d3.select('.l-top').style('width').split('px')[0]);
                setSvgHeight(180)
            }
        }else if(explanBool){
            if(!d3.select('.l-top').empty()){
                setWidth(d3.select('.l-top').style('width').split('px')[0] - 80);
                setSvgHeight(200)
            }
        }else{
            // if(!d3.select('.l-top').empty()){
            //     setWidth(d3.select('.l-top').style('width').split('px')[0] - 50);
            //     setSvgHeight(200)
            // }
        }
        // else if(!navBool && !explanBool && !d3.select('#pivot-plot').empty()){
           
        // }
        
    }, [d3.select('.l-top').empty(), d3.select('#pivot-plot').empty()]);

    let margin = () => {
        if(navBool){
            return {x:90, y:(svgHeight * .3)}
        }else if(explanBool){
            return {x:70, y:(svgHeight * .3)}
        }else{
            return {x: 50, y: 10}
        }
    };

    let plotDataOptions = {...usedPredData.attribute_data[feature], 'Score': usedPredData.attribute_score_data[feature]};
    let plotData = plotDataOptions[yCoord][0];

    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, (width - margin().x)]).padding(0.2);
    }, [width, feature])

    let extentOfData = d3.extent(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]));
    let yScale = useMemo(()=> {
        return scaleExtent ? d3.scaleLinear().domain([extentOfData[0] - (extentOfData[0]*.05), extentOfData[1]]).range([(svgHeight - (margin().y)), 0]) : d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[yCoord === 'Score' ? 'score' : yCoord]))]).range([(svgHeight - (margin().y)), 0])
    }, [svgHeight, yCoord, scaleExtent])
   
    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g').classed('wrap', true);

        if(navBool){
            wrap.attr("transform", `translate(${((margin().x/2)) + 30}, ${((margin().y/2) - 30)})`)
        }else if(explanBool){
            wrap.attr("transform", `translate(${((margin().x/2)) + 20}, ${((margin().y/2) - 20)})`)
        }else{
            wrap.attr("transform", `translate(${((margin().x/2)) + 30}, ${((margin().y/2) - 40)})`)
        }
       

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (margin().y)) + ")")
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
        .attr("height", function(d) { return (svgHeight - margin().y) - yScale(d[yCoord === 'Score' ? 'score' : yCoord]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? usedPredData.predicate_info.color : 'gray'
        }).attr('fill-opacity', .6)

        if(navBool || explanBool){
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

        }else if(explanBool){
           


        }
       
       

    }, [width, feature, yCoord, yScale, usedPredData.predicate_info.id, scaleExtent]);

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


