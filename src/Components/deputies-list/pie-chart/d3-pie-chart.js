import React, { useEffect, useRef, useState } from "components/DeputiesList/PieChart/node_modules/react"
import * as d3 from "components/DeputiesList/PieChart/node_modules/d3"
import { color } from "components/DeputiesList/PieChart/node_modules/d3"

///////////////////////////////////////////////////////////////////////////////////////
// https://www.d3-graph-gallery.com/graph/pie_basic.html
///////////////////////////////////////////////////////////////////////////////////////

const initPiechart = (props, wrapper, halfDonut = false) => {
  let ratio = 1
  if (halfDonut) {
    ratio = 0.5
  }
  const svg = d3
    .select(wrapper)
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height * ratio)
    .append("g")
    .attr(
      "transform",
      "translate(" + props.width / 2 + "," + props.height / 2 + ")"
    )

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(props.width, props.height) / 2
  const pie = d3
    .pie()
    .value(d => d.value.number)
    .sort((a, b) => {
      return d3.ascending(a.key, b.key)
    })
    .startAngle(-ratio * Math.PI)
    .endAngle(ratio * Math.PI)
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius)

  return { svg, radius, pie, arc }
}

const drawPieChart = (props, graph) => {
  const newData = props.data.filter(groupe => {
    return groupe.value
  })
  const data_ready = graph.pie(d3.entries(newData))

  graph.svg
    .selectAll("groupe")
    .data(data_ready)
    .enter()
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(0)
        .outerRadius(graph.radius)
    )
    .attr("fill", d => color(d.data.value.color.couleur))
    .attr("class", d => {
      if (d.data.value.value) {
        return "enable"
      } else {
        return "disable"
      }
    })

  graph.svg
    .selectAll("groupe")
    .data(data_ready)
    .enter()
    .append("text")
    .text(d => d.data.value.name)
    .attr("transform", d => "translate(" + graph.arc.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 12)

  graph.svg
    .selectAll("path")
    .data(data_ready)
    .exit()
    .remove()

  graph.svg
    .selectAll("text")
    .data(data_ready)
    .exit()
    .remove()
}

export default function PieChart(props) {
  const [graph, setGraph] = useState(null)
  const piechart = useRef(null)

  useEffect(() => {
    setGraph(initPiechart(props, piechart.current, true))
  }, [])
  useEffect(() => {
    if (graph) {
      drawPieChart(props, graph)
    }
  }, [graph, props.data2])

  return <div ref={piechart}></div>
}
