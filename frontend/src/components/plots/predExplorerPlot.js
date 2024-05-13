import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";


const PredScoreArea = (data, margin, axesRef, yScale, highlightedPred, negatedArray, width, height) => {
    const xScale = useMemo(() => {
        if(data.length > 0){
            let maxArr =  data.flatMap(f => f.map(m => +m.score));
            return d3.scaleLinear().range([3, width]).domain(d3.extent(maxArr));
            // return d3.scaleLinear().range([0, width]).domain([0, d3.max(maxArr)]);
        }else{
            return d3.scaleLinear().range([0, width]).domain([0, 1]);
        }}, [data, width]);

      // Render the X axis using d3.js, not react
      useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        const wrap = svgElement.append('g').attr('id', 'wrap-explore');

        wrap.attr('transform', `translate(${margin.x}, ${margin.y})`)

        const xAxisGenerator = d3.axisBottom(xScale);
        wrap
        .append("g")
        .attr("transform", "translate(0," + (height-50) + ")")
        .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        wrap.append("g").call(yAxisGenerator);

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -((height/2) - 20))
        .style("font-size", 11)
        .text("Percentage of Data Points")

        // Add X axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", (height - 5))
        .text("Anomaly Score")
        .style('font-size', 11);

        let groups = wrap.selectAll('g.pred_group').data(data).join('g').classed('pred_group', true);
        groups.attr('transform', `translate(${-1}, ${-1})`)

       
        const line = d3.line()
        .x(d => xScale(d.score))
        .y(d => yScale(d.density))
        .curve(d3.curveCatmullRom.alpha(0.5));

        const area = d3.area()
        .x(d => xScale(d.score))
        .y1(d => yScale(d.density))
        .y0(yScale(0))
        .curve(d3.curveBasis)
        // .curve(d3.curveCatmullRom.alpha(0.5));
            
        let lineSVG = groups.selectAll("path.test").data(d => {
            let test = d.sort((a, b) => a.score - b.score);
            return [test];
        }).join('path').classed('test', true);

        lineSVG.attr("fill", "none")
        .attr("stroke", d => {
            return  highlightedPred != null && highlightedPred != d[0].id ? 'rgba(211,211,211, .2)' : d[0].color;
        })
        .attr("stroke-width", 1.5)
        .attr("fill-opacity", .3)
        .attr('fill', d =>  highlightedPred != null && highlightedPred != d[0].id ? 'rgba(211,211,211, .2)' : d[0].color)
        .attr("d", d => {return area(d)});
        

    }, [data, highlightedPred, negatedArray, xScale, yScale, height]);
    


}

const PredScoreBar = (data, margin, axesRef, yScale, highlightedPred, negatedArray, width, height) => {

    const xScale = useMemo(() => {
        if(data.length > 0){
            let maxArr =  data.flatMap(f => f.map(m => +m.score));
            return d3.scaleLinear().range([1, width-(margin.x * 2)]).domain(d3.extent(maxArr));
        }else{
            return d3.scaleLinear().range([0, width - margin.x]).domain([0, 1]);
        }}, [data, width]);

      // Render the X axis using d3.js, not react
      useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();
        const wrap = svgElement.append('g').attr('id', 'wrap-explore');
        wrap.attr('transform', `translate(${margin.x * 1.5}, ${margin.y})`)
        const xAxisGenerator = d3.axisBottom(xScale);

        wrap
        .append("g")
        .attr("transform", "translate(0," + (height-50) + ")")
        .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        wrap.append("g").call(yAxisGenerator);

        // Y axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -((height/2) - 20))
        .style("font-size", 11)
        .text("Percentage of Data Points")

        // Add X axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("x", ((width - (margin.x * 2))/2))
        .attr("y", (height - 10))
        .text("Anomaly Score")
        .style('font-size', 11);

        let groups = wrap.selectAll('g.pred_group').data(data).join('g').classed('pred_group', true);
        groups.attr('transform', `translate(${-1}, ${-1})`)
        
        let bars = groups.selectAll('rect.dist').data(d => d).join('rect').classed('dist', true);
        bars.attr('fill', (d)=> {
            
            return d.predicate === true ? d.color : 'gray'
            // return calcColor(d)
        });
        bars.attr('width', 5)
        bars.attr('height', (d)=> (height - 50)-yScale(d.density))
        bars.attr('x', d=> {

            return d.predicate === true ? (xScale(d.score) + 6) : xScale(d.score)})
        bars.attr('transform', (d)=> `translate(0, ${yScale(d.density)})`)
        bars.style('fill-opacity', .5)
        bars.style('stroke', d => {
            // calcColor(d)
            return d.predicate === true ? d.color : 'gray'
        });
        
    }, [data, highlightedPred, negatedArray, xScale, yScale, height]);
}

const PredExplorePlot = ({width, height, singlePred, marginX, marginY}) => {
    
    const axesRef = useRef(null);
    const [{predicateArray, hiddenPredicates, deletedPredicates, highlightedPred, negatedArray, plotStyle},] = useContext(DataContext);
    let usedData = useMemo(() => {
        if(singlePred){
            return [singlePred].map(m => {
                // return m.predicate.dist.filter(f => f.predicate === false)
                // return m.predicate.dist.filter(f => negatedArray.indexOf(m.id) > -1 ? f.predicate === false : f.predicate === true)//.filter(f => f.density > .001)
                return m.predicate.dist.map(ag => {
                    ag.id = m.id;
                    ag.color = m.color;
                    return ag
                });
            });
        }
    }, [predicateArray, negatedArray, hiddenPredicates, deletedPredicates]);

    let margin = {x: marginX, y: marginY}

    const yScale = useMemo(() => {
        if(predicateArray.length > 0){
            let maxArr =  usedData.flatMap(f => f.map(m => +m.density));
            return d3.scaleLinear().range([(height-50), 2]).domain([0, d3.max(maxArr)]);
        }else{
             return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [usedData, height]);

    if(plotStyle === 'area'){
        PredScoreArea(usedData, margin, axesRef, yScale, highlightedPred, negatedArray, width, height, plotStyle)
    }else{
        PredScoreBar(usedData, margin, axesRef, yScale, highlightedPred, negatedArray, width, height, plotStyle)
    }

    return(
        <svg width={width} height={height + margin.y} ref={axesRef}>
        </svg>
    )
}


export {PredExplorePlot}