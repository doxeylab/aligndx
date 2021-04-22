import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { filter } from 'd3';

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

const BarChart = ({data}) => {
    // Filter NumReads of 0
    var filterData = data.filter(hit => hit.NumReads !== 0)
    // Resize Obeserver
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef)
    // Find Largest Column Value
    var max_value = Math.max(...(filterData.map(function(hit) {return hit.NumReads})));
    var yDomain = Math.ceil(max_value/5)*5;
    // Initial SVG Data
    const svgRef = useRef();
    // eslint-disable-next-line
    const svg_width = 900;
    const svg_height = 400;
    var margin = { top: 10, right: 10, bottom: 50, left: 50 },
        height = svg_height - margin.top - margin.bottom;

    useEffect(() => {
        if (filterData.length === 0) return;
        if (!dimensions) return;
        var width = dimensions.width - margin.left - margin.right

        // Setting Width & Height of SVG
        d3.selectAll(".chart")
            .attr("height", svg_height);

        // Initiate and Transform Main Chart, Brush, and Axes
        const focus = d3.select(".focus");
        const x_axis = d3.select(".x-axis");
        const y_axis = d3.select(".y-axis");

        focus.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        x_axis.attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")");
        y_axis.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Initiate Scales
        const x = d3.scaleBand()
            .domain(filterData.map(function(hit) {return hit.index}))
            .range([0, width])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, yDomain])
            .range([height, 0]);

        // Initiate Axis
        const xAxis = d3.axisBottom(x)
            .tickSize(0);
        x_axis.call(xAxis);
        const yAxis = d3.axisLeft(y)
            .tickSize(0);
        y_axis.call(yAxis);

        x_axis.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-65)");

        // Draw the chart
        focus.selectAll('.bar')
            .data(filterData)
            .enter()
            .append('rect')
            .classed("bar", true)

        focus.selectAll(".bar")
            .attr('x', function(hit) {return x(hit.index)})
            .attr('y', function(hit) {return y(hit.NumReads)})
            .attr('width', x.bandwidth())
            .attr('height', function(hit) { return height - y(hit.NumReads)})
            .attr('fill', '#2f8ae1');

// eslint-disable-next-line
    }, [dimensions]);

    return (
        <>
        {
            filterData.length === 0 ?
            <h1 ref={wrapperRef} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "400px"}}>There is no data</h1>
        :
            <div className="main" ref={wrapperRef}>
                <svg className="chart" ref={svgRef} style={{width: '100%'}}>
                    <g className="focus"></g>
                    <g className="axis x-axis"></g>
                    <g className="axis y-axis"></g>
                </svg>
            </div>
        }
        </>
    )
}

export default BarChart