import React from "react"

export default function D3Exemple() {
  // D3
  // http://bl.ocks.org/mikeyao/b5ae6670a1c1a60724c63d034bb3b8ca

  // Data
  const pValue = 0.8
  const pText = Math.round(pValue * 100) + "%"
  const pData = [pValue, 1 - pValue]
  // Settings
  const pWidth = 600
  const pHeight = 300
  const pAnglesRange = 0.5 * Math.PI
  const pRadis = Math.min(pWidth, 2 * pHeight) / 2
  const pThickness = 100
  // Utility
  const pColors = ["#5EBBF8", "#F5F5F5"]
  const pPies = d3
    .pie()
    .value(d => d)
    .sort(null)
    .startAngle(pAnglesRange * -1)
    .endAngle(pAnglesRange)
  const pArc = d3
    .arc()
    .outerRadius(pRadis)
    .innerRadius(pRadis - pThickness)

  const pTranslation = (x, y) => `translate(${x}, ${y})` // Feel free to change or delete any of the code you see in this editor!

  const pSvg = d3
    .select("body")
    .append("svg")
    .attr("width", pWidth)
    .attr("height", pHeight)
    .attr("class", "half-donut")
    .append("g")
    .attr("transform", pTranslation(pWidth / 2, pHeight))

  pSvg
    .selectAll("path")
    .data(pPies(pData))
    .enter()
    .append("path")
    .attr("fill", (d, i) => pColors[i])
    .attr("d", pArc)

  pSvg
    .append("text")
    .text(d => pText)
    .attr("dy", "-3rem")
    .attr("class", "label")
    .attr("text-anchor", "middle")

  return <div></div>
}
