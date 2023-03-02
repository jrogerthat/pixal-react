import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";
import * as d3 from "d3";


export const FeatureDotPlot = ({xCoord, yCoord, categorical, navBool}) => {
 
    const isDate = (date) => (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    const [{selectedPredicate, categoricalFeatures}, dispatch] = useContext(DataContext);
    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(navBool ? 200 : 300);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    let plotDataOptions = {...selectedPredicate.attribute_data[xCoord], 'Score': selectedPredicate.attribute_score_data[xCoord]};

    let plotData = plotDataOptions[yCoord][0];

    console.log('d3 max!!', d3.max(plotData.map(m => m[xCoord])))

    let xScale = useMemo(()=> {
        // if(categorical){
        //     return d3.scaleBand().domain(plotData.map(m => m[xCoord])).range([0, (svgWidth - svgMargin.x)]).padding(0.2);
        // }else{
        //     return d3.scaleLinear().domain([0, d3.max(plotData.map(m => m[xCoord]))]).range([0, (svgWidth - svgMargin.x)])
        // }
       return d3.scaleLinear().domain([0, d3.max(plotData.map(m => m[xCoord]))]).range([0, (svgWidth - svgMargin.x)])
    }, [svgWidth, xCoord]);

    
    
    let yScale = useMemo(()=> {
        return d3.scaleLinear().domain(d3.extent(plotData.map(m => m[yCoord === 'Score' ? yCoord.toLowerCase() : yCoord]))).range([(svgHeight - (svgMargin.y)), 0])
    }, [yCoord]);

    const svgRef = useRef(null);
    const divRef = useRef();

    useEffect(()=> {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let newW = navBool ? d3.select('#feat-nav-wrap-left').select('.feature-nav').node().getBoundingClientRect().width : 700;
        let newMargX = newW * .3;
        let newMargY = svgHeight * .2;

        // setSvgHeight(newH)
        setSvgWidth(newW)
        setSvgMargin({x: newMargX, y: newMargY})

        let wrap = svg.append('g');

        wrap.attr('transform', 'translate(20, 20)')

        let xAxis = wrap.append("g")
        .attr("transform", "translate(0," + (svgHeight - svgMargin.y) + ")")
        .call(d3.axisBottom(xScale))

        if(categorical){
            xAxis.selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        }
       
        let yAxis = wrap.append('g')
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));

        let points = wrap.selectAll('circle.point').data(plotData).join('circle').classed('point', true);
        points.attr('cx', (d) => xScale(+d[xCoord]))
        points.attr('cy', (d)=> {
            console.log(d[yCoord], d, yCoord)
            return yScale(+d[yCoord.toLowerCase()])}).attr('r', 4)

    }, [xCoord, yCoord, yScale, xScale, selectedPredicate.predicate_info.id]);

    return(
        <div 
        className="feature-bar"
        >
            <div ref={divRef}>
                <svg 
                style={{width:(svgWidth - (svgMargin.x / 2)), height:(svgHeight)}}
                ref={svgRef} />
            </div>
        </div>
    )
}


