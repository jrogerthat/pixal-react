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

export {PredScorePlot}

const KDEPlot = () => {

}

const DensityBarPlot = () => {
    
}