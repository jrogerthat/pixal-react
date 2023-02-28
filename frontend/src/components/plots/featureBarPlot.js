import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureBarPlot = ({selectedParam}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate}, dispatch] = useContext(DataContext);

    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(300);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    const feature = selectedPredicate.feature[0];

    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};

    let plotData = plotDataOptions[selectedParam][0];


    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, (svgWidth - svgMargin.x)]).padding(0.2);
    }, [svgWidth])
    
    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[selectedParam === 'Score' ? 'score' : selectedParam]))]).range([(svgHeight - (svgMargin.y)), 0])
    }, [svgHeight])
   
    const svgRef = useRef(null);
    const divRef = useRef();

    

    
    useEffect(()=> {


        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        console.log('SVG NODE', svg.node().parentNode.parentNode.parentNode.parentNode, svg.node().parentNode.getBoundingClientRect())
        // let newH = svg.node().parentNode.getBoundingClientRect().height;
        let newW = svg.node().parentNode.parentNode.parentNode.parentNode.getBoundingClientRect().width;
        
        let newMargX = newW * .3;
        let newMargY = svgHeight * .3;

        // setSvgHeight(newH)
        setSvgWidth(newW)
        setSvgMargin({x: newMargX, y: newMargY})


        let wrap = svg.append('g');

        wrap.attr("transform", 'translate(40, 10)')

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - (svgMargin.y)) + ")")

        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let yAxis = wrap.append('g')
        .attr("transform", "translate(-5, 0)")
        .call(d3.axisLeft(yScale));

        let bars = wrap.selectAll('rect.bar').data(plotData)
        .join('rect').attr("x", function(d) { return xScale(d[feature]); })
        .attr("y", function(d) { return yScale(d[selectedParam === 'Score' ? 'score' : selectedParam]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return (svgHeight - svgMargin.y) - yScale(d[selectedParam === 'Score' ? 'score' : selectedParam]); })
        .attr("fill", (d) => {
            return d.predicate === 1 ? selectedPredicate.predicate_info.color : 'gray'
        })


    }, [selectedPredicate, selectedParam, yScale]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:(svgWidth), height:(svgHeight)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


