import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";


function kde(kernel, thresholds, data) {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - +d.score))]);
}

function epanechnikov(bandwidth) {
    return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}

const PredScorePlot = ({navBool}) => {
   
    const [{selectedPredicate}, dispatch] = useContext(DataContext);


    return(
        // <KDEPlot />
        <DensityBarPlot navBool={navBool} />

    )
    
}

export {PredScorePlot}

const KDEPlot = () => {

    const svgRef = useRef(null);

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    const data = selectedPredicate.predicate_scores;
   
    const bandwidth = .06

    let maxScore = d3.max(data.map(m => m.score));

    let [svgWidth, setSvgWidth] = useState(selectedPredicate.feature ? 300 : 600);
    let [svgHeight, setSvgHeight] = useState(300);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    let groupData = Array.from(d3.group(data, d => d.predicate));
    let predData = groupData.filter(f => f[0] === true)[0][1];
    let notPredData = groupData.filter(f => f[0] === false)[0][1];

    let x = useMemo(()=> {
        return d3.scaleLinear()
        .domain([0, maxScore])
        .range([(svgMargin.x / 2), svgWidth]);

    }, [svgWidth, data, selectedPredicate.feature]);

    const thresholds = x.ticks(50)

    // let densityAll = kde(epanechnikov(bandwidth), thresholds, data);

    let densityP = useMemo(() => {
        return [[0,0], ...kde(epanechnikov(bandwidth), thresholds, predData), [1, 0]];
    }, [selectedPredicate])

    let densityN = useMemo(()=> {
        return [[0,0], ...kde(epanechnikov(bandwidth), thresholds, notPredData), [1, 0]];
    }, [selectedPredicate])
    

    // let yMaxAll = d3.extent(densityAll.map(m => m[1]))

    let yMaxP = d3.extent(densityP.map(m => m[1]))

    let yMaxN = d3.extent(densityN.map(m => m[1]))

    let testMax = d3.max([yMaxP[1], yMaxN[1]]);


    let y = useMemo(()=> {
        return d3.scaleLinear()
        .domain([0, testMax])
        .range([(svgHeight - (svgMargin.y / 2)), 0])
    }, [svgHeight, selectedPredicate]);
   

    const line = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]))

    useEffect(()=> {
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let newW = svg.node().parentNode.getBoundingClientRect().width;
        
        let newMargX = newW * .3;
        let newMargY = svgHeight * .3;

        // setSvgHeight(newH)
        setSvgWidth(newW)
        setSvgMargin({x: newMargX, y: newMargY})

        const xAxis = d3.axisBottom(x);

        svg
        .append("g")
        .attr("transform", "translate(0," + (svgHeight - (svgMargin.y/2)) + ")")
        .call(xAxis);

        const yAxis = d3.axisLeft(y);

        let xAxisGroup = svg.append("g").call(yAxis)
        .attr("transform", "translate("+(svgMargin.x / 2)+",0)");

        // xAxisGroup.append('label').text('Score')

        svg.append("path")
            .datum(densityN)
            .attr("fill", "#000")
            .attr("fill-opacity", 0.1)
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("d", line);

        svg.append("path")
            .datum(densityP)
            .attr("fill", "none")
            .attr("stroke", selectedPredicate.predicate_info.color)
            .attr("fill", selectedPredicate.predicate_info.color)
            .attr("fill-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("d", line);

    }, [selectedPredicate, selectedPredicate.feature]);

    return(
        <svg ref={svgRef} width={svgWidth} height={svgHeight} />
    )

}

const DensityBarPlot = ({navBool}) => {
    const [{selectedPredicate},dispatch] = useContext(DataContext);
    console.log('NAV',navBool)
    // let [width, setWidth] = useState(navBool ? d3.select('#feat-nav-wrap-left').select('.feature-nav').node().getBoundingClientRect().width : 700);
    let [width, setWidth] = useState(navBool === true ? 350 : 700);
    let [height, setHeight] = useState(navBool ? 200 : 300);
    let [margin, setMargin] = useState({x:(width * .2), y:(height * .3)});


    console.log('width in predc=score plot',width)

    const svgRef = useRef(null);
    let groupData =  Array.from(d3.group(selectedPredicate.predicate_scores, (s)=> s.predicate));
    
    const yScale = useMemo(() => {
        return d3.scaleLinear().range([(height - margin.y), 0]).domain([0, d3.max(selectedPredicate.predicate_scores.map(m => +m.density))]);
      }, [selectedPredicate.id, selectedPredicate.feature]);

    const xScale = useMemo(() => {
        return d3.scaleLinear().range([0, width - (margin.x)]).domain([0, d3.max(selectedPredicate.predicate_scores.map(m => +m.score))]);
        }, [selectedPredicate.id, selectedPredicate.feature]);
  

    useEffect(()=> {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        let wrap = svg.append('g');
        wrap.attr('transform', `translate(${margin.x/2}, ${margin.y/2})`)

        const xAxisGenerator = d3.axisBottom(xScale);

        wrap
        .append("g")
        .attr("transform", "translate(0," + (height-(margin.y)) + ")")
        .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        wrap.append("g").call(yAxisGenerator);

        let groups = wrap.selectAll('g.group').data(groupData).join('g').classed('group', true);

        let bars = groups.selectAll('rect.bar').data(d => d[1])
        .join('rect').attr("x", function(d) { return xScale(+d.score); })
        .attr("y", function(d) { return yScale(+d.density); })
        .attr("width", navBool === true ? 5 : 15)
        .attr("height", function(d) { return (height - margin.y) - yScale(+d.density); })
        .attr("fill", (d) => {
            return d.predicate === true ? selectedPredicate.predicate_info.color : 'gray'
        }).attr('fill-opacity', .5)

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -(height/4))
        .text("Density")

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", (height))
        .text("Score");

    }, [selectedPredicate.predicate_info.id, selectedPredicate.feature, selectedPredicate]);


    return(
        <div><svg ref={svgRef} width={width} height={height} /></div>
    )
}