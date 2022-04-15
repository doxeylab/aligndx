import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import useComponentId from '../../hooks/useComponentId'

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect);
            })
        })
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget)
        }
    }, [ref])
    return dimensions;
}

const BarChart = ({id, data, yLabel, xLabel, ykey, xkey}) => { 

    // Filter NumReads of 0
    var filterData = data.filter(hit => hit[ykey] !== 0) 
    // Resize Obeserver
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef)
    // Find Largest Column Value
    var max_value = Math.max(...(filterData.map(function(hit) {return hit[ykey]})));
    var yDomain = Math.ceil(max_value/1)*1;
    // Initial SVG Data
    const svgRef = useRef();
    // eslint-disable-next-line
    const svg_width = 900;
    const svg_height = 400;
    var margin = { top: 10, right: 10, bottom: 160, left: 50 },
        height = svg_height - margin.top - margin.bottom;


    // Setting Width & Height of SVG
    const svg = d3.selectAll(`.chart${id}`).attr("height", svg_height);

    // Initiate and Transform Main Chart, Brush, and Axes
    const focus = svg.selectAll(".focus")
    const x_axis = svg.selectAll(".x-axis")
    const y_axis = svg.selectAll(".y-axis")
    const y_label = svg.selectAll(".y-label")
    const x_label = svg.selectAll(".x-label")

    useEffect(() => {
        if (filterData.length === 0) return;
        if (!dimensions) return;
        var width = dimensions.width - margin.left - margin.right

        focus.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        x_axis.attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")");
        y_axis.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x_label.selectAll("text")   
            .attr("transform",
                "translate(" + (dimensions.width/2) + " ," + 
                                (height + margin.top + 150) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text(xLabel);

        y_label.selectAll("text")            
            .attr("transform", "rotate(-90)")
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text(yLabel); 

        // Initiate Scales
        const x = d3.scaleBand()
            .domain(filterData.map(function(hit) {return hit[xkey]}))
            .range([0, width])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, yDomain])
            .range([height, 0]);

        x_axis.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-65)");

        // Initiate Axis
        const xAxis = d3.axisBottom(x)
            .tickSize(0);
        x_axis.call(xAxis);
        const yAxis = d3.axisLeft(y)
            .tickSize(0);
        y_axis.call(yAxis);

        // Draw the chart
        focus.selectAll('.bar')
            .data(filterData)
            .enter()
            .append('rect')
            .classed("bar", true)

        focus.selectAll(".bar")
            .attr('x', function(hit) {return x(hit[xkey])})
            .attr('y', function(hit) {return y(0)})
            .attr('width', x.bandwidth())
            .attr('height', function(hit) { return height - y(0)})
            .attr('fill', '#2f8ae1');
        
        // Animate bars on pageload
        focus.selectAll("rect")
            // .transition()
            // .duration(800)
            .attr("y", function(d) { return y(d[ykey]); })
            .attr("height", function(d) { return height - y(d[ykey])}) 
            // .delay(function(d,i){return(i*100)})

// eslint-disable-next-line
    }, [dimensions, data]); 
 
    return (
        <div>
        {
            filterData.length === 0 ?
            <h1 ref={wrapperRef} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "400px"}}>There is no data</h1>
        :
            <div className="main" ref={wrapperRef}>
                <svg className={`chart${id}`} ref={svgRef} style={{width: '100%'}}>
                    <g className="focus"></g>
                    <g className="x-axis"></g>
                    <g className="y-axis"></g>
                    <g className="y-label">
                        <text></text>
                    </g>
                    <g className="x-label">
                        <text></text>
                    </g>
                </svg>
            </div>
        }
        </div>
    )
}

export default BarChart