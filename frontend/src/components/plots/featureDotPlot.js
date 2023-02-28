import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureDotPlot = ({selectedParam}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate, categoricalFeatures}, dispatch] = useContext(DataContext);

    const feature = selectedPredicate.feature[0];

    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(400);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    // let plotData = useMemo(() => { return selectedPredicate.attribute_score_data[feature[0]]}, [selectedPredicate]);
    let plotDataOptions = {...selectedPredicate.attribute_data[feature], 'Score': selectedPredicate.attribute_score_data[feature]};

    let plotData = plotDataOptions[selectedParam][0];

    console.log('plotdata',plotData)

    let xScale = useMemo(()=> {
        return d3.scaleBand().domain(plotData.map(m => m[feature])).range([0, (svgWidth - svgMargin.x)]).padding(0.2);
    }, [svgWidth]);
    
    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain([0,d3.max(plotData.map(m => m[selectedParam === 'Score' ? 'score' : selectedParam]))]).range([(svgHeight - (svgMargin.y)), 0])
    }, [svgHeight]);
    
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

        wrap.attr('transform', 'translate(20, 0)')


        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - svgMargin.y) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let yAxis = wrap.append('g')
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));

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


