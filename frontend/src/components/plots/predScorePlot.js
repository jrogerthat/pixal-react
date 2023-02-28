import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataContext } from "../../context";


function kde(kernel, thresholds, data) {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - +d.score))]);
}

function epanechnikov(bandwidth) {
    return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}


// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  function kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }


const PredScorePlot = () => {
   
    const svgRef = useRef(null);

    const [{selectedPredicate}, dispatch] = useContext(DataContext);
    const data = selectedPredicate.predicate_scores;
    // const margin = {top: 20, right: 30, bottom: 50, left: 40}
    const bandwidth = .06

    let maxScore = d3.max(data.map(m => m.score));

    let [svgWidth, setSvgWidth] = useState(600);
    let [svgHeight, setSvgHeight] = useState(300);
    let [svgMargin, setSvgMargin] = useState({x:100, y:100})

    let groupData = Array.from(d3.group(data, d => d.predicate));
    let predData = groupData.filter(f => f[0] === true)[0][1];
    let notPredData = groupData.filter(f => f[0] === false)[0][1];

    let x = useMemo(()=> {
        return d3.scaleLinear()
        .domain([0, maxScore])
        .range([(svgMargin.x / 2), svgWidth]);

    }, [svgWidth, selectedPredicate, selectedPredicate.feature]);

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
        console.log('selectedPREDICATE', selectedPredicate);
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        console.log('SVG NODE', svg.node().parentNode, svg.node().parentNode.getBoundingClientRect())
        // let newH = svg.node().parentNode.getBoundingClientRect().height;
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

export {PredScorePlot}

// const x = useMemo(() => {
//     return d3.scaleLinear().range([0, (width - 50)]).domain([0, d3.max(sortedScores.map(f => f.score))]);
// }, [sortedScores, width]);

// var histogram = d3.bin()
//   .value(function(d) { return +d.score; })   // I need to give the vector of value
//   .domain(x.domain())  // then the domain of the graphic
//   .thresholds(x.ticks(50)); // then the numbers of bins


//  // And apply twice this function to data to get the bins.
// var bins1 = histogram(sortedScores.filter( function(d){return d.predicate === false} ));
// var bins2 = histogram(sortedScores.filter( function(d){return d.predicate === true} ));

// // Y axis: scale and draw:
// let y = d3.scaleLinear()
//   .range([(height - 50), 0]);
//   y.domain([0, d3.max(bins1, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously



//   // Render the X axis using d3.js, not react
// useEffect(() => {
//     const svg = d3.select(axesRef.current);
//     svg.selectAll("*").remove();
//     const xAxisGenerator = d3.axisBottom(x);
    
//     svg.append("g")
//     .call(d3.axisLeft(y));

// // append the bars for series 1
// svg.selectAll("rect.notPred")
//     .data(bins1)
//     .join("rect")
//     .classed("notPred", true)
//       .attr("x", 1)
//       .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//       .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
//       .attr("height", function(d) { return (height - 50) - y(d.length); })
//       .style("fill", "#69b3a2")
//       .style("opacity", 0.5)

// // append the bars for series 2
// svg.selectAll("rect.pred")
//     .data(bins2)
//     .join("rect")
//     .classed("pred", true)
//       .attr("x", 1)
//       .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//       .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
//       .attr("height", function(d) { return (height - 50) - y(d.length); })
//       .style("fill", "#404080")
//       .style("opacity", 0.5)