import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";


const PredScorePlot = ({width, height}) => {
   
    const axesRef = useRef(null);

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
        };}

    /**
     * START PRED SCORE SAMPLE
     */

      // Compute kernel density estimation
//   var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60))
//   var density1 =  kde( data
//       .filter( function(d){return d.type === "variable 1"} )
//       .map(function(d){  return d.value; }) )
//   var density2 =  kde( data
//       .filter( function(d){return d.type === "variable 2"} )
//       .map(function(d){  return d.value; }) )
  
//   svg.append("path")
//       .attr("class", "mypath")
//       .datum(density1)
//       .attr("fill", "#69b3a2")
//       .attr("opacity", ".6")
//       .attr("stroke", "#000")
//       .attr("stroke-width", 1)
//       .attr("stroke-linejoin", "round")
//       .attr("d",  d3.line()
//         .curve(d3.curveBasis)
//           .x(function(d) { return x(d[0]); })
//           .y(function(d) { return y(d[1]); })
//       );
//   svg.append("path")
//       .attr("class", "mypath")
//       .datum(density2)
//       .attr("fill", "#404080")
//       .attr("opacity", ".6")
//       .attr("stroke", "#000")
//       .attr("stroke-width", 1)
//       .attr("stroke-linejoin", "round")
//       .attr("d",  d3.line()
//         .curve(d3.curveBasis)
//           .x(function(d) { return x(d[0]); })
//           .y(function(d) { return y(d[1]); })
//       );

    const [{selectedPredicate}, dispatch] = useContext(DataContext);

   

    const sortedScores = selectedPredicate.predicate_scores.sort((a, b) => {
        return a.score - b.score;
    });

    console.log('sorted scores',sortedScores)

    const xScale = useMemo(() => {
        return d3.scaleLinear().range([0, width]).domain([-10,15])
        // .domain([0, d3.max(sortedScores.map(f => f.score))]);
    }, [sortedScores, width]);

    const kde = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(60));

    let densityPred =  kde( sortedScores
    .filter( function(d){return d.predicate === true} )
    .map(function(d){  return d.score; }) )

    let densityNot =  kde( sortedScores
        .filter( function(d){return d.predicate === false} )
        .map(function(d){  return d.score; }) )

    console.log(d3.max([...densityPred, ...densityNot].map(m => m[1])))

    let maxVal = d3.max(kde(sortedScores.map(f => f.score)));

    const yScale = useMemo(() => {
        d3.max(sortedScores.map(f => f.density))
        return d3.scaleLinear().range([height, 0]).domain([0, 0.12]);//.domain([0, maxVal[1]]);
    }, [sortedScores, height]);


      // Render the X axis using d3.js, not react
    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();
        const xAxisGenerator = d3.axisBottom(xScale);
        
        let axisGroup = svgElement
            .append("g")
            .attr("transform", "translate(0," + (height - 20) + ")")
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement.append("g").call(yAxisGenerator);

        let notGroup = svgElement.append('g').classed('not-dist', true);
        let predGroup = svgElement.append('g').classed('pred-dist', true);

        predGroup.append("path")
        .attr("class", "mypath")
        .datum(densityPred)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".6")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return xScale(d[0]); })
          .y(function(d) { return yScale(d[1]); })
      );

        notGroup.append("path")
            .attr("class", "mypath")
            .datum(densityNot)
            .attr("fill", "#404080")
            .attr("opacity", ".6")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d",  d3.line()
                .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); })
      );


    }, [xScale, yScale, height]);

    // let distScoreData = Array.from(d3.group(sortedScores, d => d.predicate));

    return(
        <svg width={width} height={height}>
            {/* {
                distScoreData.map(d => (
                    <ScoreGroup key={`isPred${d[0]}`} data={d} yScale={yScale} xScale={xScale} />
                ))
            } */}
            <g
            width={width}
            height={20}
            ref={axesRef}
            transform={`translate(${[30, 30].join(",")})`}
            />
        </svg>
    )
}

const ScoreGroup = ({data, xScale, yScale}) => {
    let color = data[0] ? 'blue' : 'gray';

    const gRef = useRef(null);

    useEffect(()=> {

        const gElement = d3.select(gRef.current);
        gElement.append("path")
        .attr("class", "mypath")
        .datum(data[1])
        .attr("fill", color)
        .attr("opacity", ".6")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d.iforest_score); })
            .y(function(d) { return yScale(d.density); })
        );

    }, [data]);

    return(
        <g ref={gRef}>{data[0]}</g>
    )
}



export {PredScorePlot}