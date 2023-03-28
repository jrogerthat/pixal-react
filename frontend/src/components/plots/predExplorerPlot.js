import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context";

const PredExplorePlot = ({width, height}) => {
    
    const axesRef = useRef(null);
    const [{predicateArray, hiddenPredicates, deletedPredicates, highlightedPred, negatedArray},] = useContext(DataContext);

    let usedData = useMemo(() => {
        return [...predicateArray].filter(f => {
            if(hiddenPredicates.length === 0 && deletedPredicates.length === 0){
                return f
            }else{
                return hiddenPredicates.indexOf(f.id) === -1 && deletedPredicates.indexOf(f.id) === -1
            }
        }).map(m => {
            return m.predicate.dist.filter(f => negatedArray.indexOf(m.id) > -1 ? f.predicate === false : f.predicate === true).filter(f => f.density > .001)
            .map(ag => {
                ag.id = m.id;
                ag.color = m.color;
                return ag
            });
        });

    }, [predicateArray, negatedArray, hiddenPredicates, deletedPredicates]);

    let margin = {x: 60, y: 30}


    const yScale = useMemo(() => {
        if(predicateArray.length > 0){
            let maxArr =  usedData.flatMap(f => f.map(m => +m.density));

            console.log('maxArr',maxArr)
            return d3.scaleLinear().range([(height-50), 2]).domain([0, d3.max(maxArr)]);
        }else{
             return d3.scaleLinear().range([height, 0]).domain([0, 1]);
        }}, [usedData, height]);

    const xScale = useMemo(() => {
        if(predicateArray.length > 0){
            let maxArr =  usedData.flatMap(f => f.map(m => +m.score));
            return d3.scaleLinear().range([3, width]).domain(d3.extent(maxArr));
            // return d3.scaleLinear().range([0, width]).domain([0, d3.max(maxArr)]);
        }else{
            return d3.scaleLinear().range([0, width]).domain([0, 1]);
        }}, [usedData, width]);
    

    const calcColor = (d) => {
        return highlightedPred != null && highlightedPred != d.id ? 'rgba(211,211,211, .2)' : d.color;
    }

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
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -(height/4))
        .text("Percentage of Data Points")

        // Add X axis label:
        wrap.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", (height - 20))
        .text("Anomaly Score")
        .style('font-size', 13);

        let groups = wrap.selectAll('g.pred_group').data(usedData).join('g').classed('pred_group', true);

        let bars = groups.selectAll('rect.dist').data(d => d).join('rect').classed('dist', true);

        bars.attr('fill', (d)=> calcColor(d));
        bars.attr('width', 5)
        bars.attr('height', (d)=> (height - 50)-yScale(d.density))
        bars.attr('x', d=> xScale(d.score) - 2.5)
        bars.attr('transform', (d)=> `translate(0, ${yScale(d.density)})`)
        bars.style('fill-opacity', .6)
        bars.style('stroke', d => calcColor(d));

    }, [usedData, highlightedPred, negatedArray, xScale, yScale, height]);
    
   
    return(
        <svg width={width + (margin.x * 2)} height={height + margin.y} ref={axesRef}>
            {/* {
                filteredDist.length > 0 && filteredDist.map((p, i) => (
                    <PredicateGroup 
                    key={`pred-${i+1}`} 
                    predData={p} 
                    xScale={xScale} 
                    yScale={yScale} 
                    height={height} 
                    // color={predicateArray.filter(f=> +p[0] === +f.id)[0]}
                    />
                ))
            } */}
            {/* <g
            width={width}
            height={20}
            ref={axesRef}
            transform={`translate(${[60, 30].join(",")})`}
            /> */}
        </svg>
    )
}

const PredicateGroup = ({predData, yScale, xScale, height}) => {

    const [{highlightedPred, negatedArray}] = useContext(DataContext);

    let calcColor = highlightedPred != null && highlightedPred != predData.id ? 'rgba(211,211,211, .2)' : predData.color;

    let predDistData = [...predData.predicate.dist].filter(f => {
        if(negatedArray.indexOf(predData.id) > -1){
            return f.predicate === false;
        }else{
            return f.predicate === true;
        }
        
    });

        return(
        <g
        transform={`translate(${[60, 0].join(",")})`}
        >
        {
            predDistData.map((p, i) => {
                return (
                <rect key={`b-${i}`}
                    fill={calcColor}
                    x={xScale(p.score)} 
                    width="5px" 
                    height={(height - 50)-yScale(p.density)}
                    transform={`translate(0,${yScale(p.density) + 30})`}
                    style={{fillOpacity: .6, stroke: calcColor}}
                />
            )})
        }
        </g>
    )
}

export {PredExplorePlot}