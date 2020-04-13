import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import { color } from "d3"

///////////////////////////////////////////////////////////////////////////////////////
// https://www.freecodecamp.org/news/how-to-get-started-with-d3-and-react-c7da74a5bd9f/
///////////////////////////////////////////////////////////////////////////////////////

const drawBarChart = (data, wrapper, width, height) => {
  const barWidth = width / data.length
  const svgCanvas = d3
    .select(wrapper)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function(d) {
        return d.number
      }),
    ])
    .range([0, height])

  svgCanvas
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", d => yScale(d.number))
    .attr("fill", "orange")
    .attr("fill", d => color(d.color.couleur))
    .attr("x", (d, iteration) => iteration * barWidth)
    .attr("y", d => height - yScale(d.number))
    .attr("class", "bar")

  svgCanvas
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", (d, i) => Math.min(height - yScale(d.number) + 20, height))
    .text(d => d.name)
}

export default function BarChart(props) {
  const barchart = useRef(null)
  useEffect(() => {
    drawBarChart(props.data, barchart.current, props.width, props.height)
  }, [])

  return <div ref={barchart}></div>
}
