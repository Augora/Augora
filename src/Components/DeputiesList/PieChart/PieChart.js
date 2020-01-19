import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

const canvasHeight = 400
const canvasWidth = 600
const barWidth = 40

const drawPieChart = (data, wrapper) => {
  console.log(data)
  const svgCanvas = d3.select(wrapper)
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight)
    .style("border", "1px solid black")

    svgCanvas.selectAll('rect')
      .data(data).enter()
      .append("rect")
      .attr("width", barWidth)
      .attr("height", (datapoint) => datapoint.number)
      .attr("fill", "orange")
      .attr("x", (datapoint, iteration) => iteration * (barWidth + 5))
      .attr("y", (datapoint) => canvasHeight - datapoint.number)
      .attr("class", "bar")

    svgCanvas.selectAll("text")
      .data(data).enter()
      .append("text")
      .attr("x", (dataPoint, i) => i * 45 + 10)
      .attr("y", (dataPoint, i) => canvasHeight - dataPoint.number - 10)
      .text(dataPoint => dataPoint.name)
}

export default function PieChart(props) {
  const piechart = useRef(null)
  // D3 /////////////////////////////////////////////////////////////////////////////////
  // https://www.freecodecamp.org/news/how-to-get-started-with-d3-and-react-c7da74a5bd9f/
  ///////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // const groupeData = Object.keys(props.data)
    // console.log(groupeData)
    // d3.select(piechart.current)
    //   .selectAll("div")
    //   .data(groupeData)
    //   .enter()
    //   .append("div")
    //   .attr("class", "groupe")
    //   .text(groupe => groupe + " !")
    drawPieChart(props.data, piechart.current)
  }, [props.data])
  ///////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <div ref={piechart}></div>
    </div>
  )
}
