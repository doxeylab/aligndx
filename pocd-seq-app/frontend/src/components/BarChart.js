import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

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
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef)
    // Find Largest Column Value
    var max_value = Math.max(...(data.map(function(hit) {return hit.column_category})));
    var yDomain = Math.ceil(max_value/5)*5;
    // Initial SVG Data
    const svgRef = useRef();
    // eslint-disable-next-line
    const svg_width = 900;
    const svg_height = 400;
    var margin = { top: 10, right: 10, bottom: 50, left: 50 },
        height = svg_height - margin.top - margin.bottom;

    useEffect(() => {
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
            .domain(data.map(function(hit) {return hit.index}))
            .range([0, width])
            .padding(0.5);
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

        focus.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
                .attr('x', function(hit) {return x(hit.index)})
                .attr('y', function(hit) {return y(hit.column_category)})
                .attr('width', x.bandwidth())
                .attr('height', function(hit) { return height - y(hit.column_category)})
                .attr('fill', '#69b3a2');
// eslint-disable-next-line
    }, [dimensions]);

    return (
        <div className="main" ref={wrapperRef}>
            <svg className="chart" ref={svgRef} style={{width: '100%'}}>
                <g className="focus"></g>
                <g className="axis x-axis"></g>
                <g className="axis y-axis"></g>
            </svg>
        </div>
    )
}

export default BarChart