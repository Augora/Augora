import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import { color } from "d3"

///////////////////////////////////////////////////////////////////////////////////////
// https://www.d3-graph-gallery.com/graph/pie_basic.html
///////////////////////////////////////////////////////////////////////////////////////

const drawPieChart = (data, wrapper, width, height, halfDonut = false) => {
  let ratio = 1
  if (halfDonut) {
    ratio = 0.5
  }

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2

  const svg = d3
    .select(wrapper)
    .append("svg")
    .attr("width", width)
    .attr("height", height * ratio)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

  const pie = d3
    .pie()
    .value(d => d.value.number)
    .startAngle(-ratio * Math.PI)
    .endAngle(ratio * Math.PI)
  const arcGenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius)

  const data_ready = pie(d3.entries(data))

  svg
    .selectAll("groupe")
    .data(data_ready)
    .enter()
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)
    )
    .attr("fill", d => color(d.data.value.color.couleur))

  svg
    .selectAll("groupe")
    .data(data_ready)
    .enter()
    .append("text")
    .text(d => d.data.value.name)
    .attr("transform", d => "translate(" + arcGenerator.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 17)
}

export default function PieChart(props) {
  const piechart = useRef(null)
  useEffect(() => {
    drawPieChart(props.data, piechart.current, props.width, props.height, true)
  }, [props.data])

  return <div ref={piechart}></div>
}
